"""Bounded metadata-only restore from this repository's trusted daily workflow.
Never extract an archive: read only two fixed JSON members into fixed paths.
"""
import io
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request
import zipfile

MAX_BYTES = 2_000_000
FILES = ('policy-discovery.json', 'policy-discovery-journal.json')


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(url, token=None):
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'BESSPolicyMetadataRestore/1.0'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    try:
        response = urllib.request.build_opener(NoRedirect).open(urllib.request.Request(url, headers=headers), timeout=20)
    except urllib.error.HTTPError as error:
        if error.code not in (301, 302, 303, 307, 308):
            raise
        location = error.headers.get('Location', '')
        target = urllib.parse.urlsplit(location)
        # The API returned this signed artifact destination. Never forward its token.
        if token and target.scheme == 'https' and not target.username and not target.password and target.port in (None, 443) and target.hostname and target.hostname.endswith('.blob.core.windows.net'):
            return request(location)
        raise ValueError('Unapproved artifact redirect') from None
    with response:
        data = response.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError('Artifact response exceeds size limit')
    return data


def trusted_run(run, repo):
    return run.get('head_branch') == 'main' and run.get('path') == '.github/workflows/etl.yml' and run.get('head_repository', {}).get('full_name') == repo and run.get('event') in ('schedule', 'workflow_dispatch') and run.get('status') == 'completed' and isinstance(run.get('id'), int)


def decode_archive(data):
    result = {}
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        entries = archive.infolist()
        if len(entries) > 5:
            raise ValueError('Too many artifact entries')
        has_journal = 'policy-discovery-journal.json' in archive.namelist()
        for name in FILES if has_journal else FILES[:1]:
            matches = [entry for entry in entries if entry.filename == name]
            if len(matches) != 1 or matches[0].file_size > MAX_BYTES:
                raise ValueError('Missing, duplicate or oversize metadata member')
            entry = matches[0]
            if entry.is_dir() or (entry.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError('Symbolic metadata member')
            with archive.open(entry) as handle:
                raw = handle.read(MAX_BYTES + 1)
            if len(raw) > MAX_BYTES:
                raise ValueError('Metadata exceeds size limit')
            parsed = json.loads(raw)
            if not isinstance(parsed, dict) or parsed.get('schemaVersion') != 1 or not isinstance(parsed.get('records'), list):
                raise ValueError('Invalid metadata schema')
            result[name] = raw
        if not has_journal:
            report = json.loads(result['policy-discovery.json'])
            records = report['records']
            if len(records) != 4 or {r.get('id') for r in records} != {'de-agnes', 'gb-connections', 'nem-iess', 'wa-wic'} or any(r.get('status') != 'pending_source_review' or r.get('lastKnownGood') or r.get('lastSuccessfulAt') or r.get('stopReason') for r in records):
                raise ValueError('Missing journal without a provably inactive legacy baseline')
    return result


def restore(repo, token):
    if not re.fullmatch(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+', repo):
        raise ValueError('Invalid repository')
    base = 'https://api.github.com/repos/' + repo
    runs = json.loads(request(base + '/actions/workflows/etl.yml/runs?branch=main&status=completed&per_page=20', token))
    for run in [run for run in runs.get('workflow_runs', []) if trusted_run(run, repo)][:5]:
        jobs = json.loads(request(base + '/actions/runs/' + str(run['id']) + '/jobs?per_page=100', token))
        policy_jobs = [job for job in jobs.get('jobs', []) if job.get('name') == 'Policy discovery, shadow only']
        if len(policy_jobs) != 1:
            return {}, run['id'], 'gap'
        job = policy_jobs[0]
        if job.get('conclusion') == 'skipped' and run.get('conclusion') != 'cancelled':
            continue
        if job.get('status') != 'completed' or job.get('conclusion') != 'success':
            return {}, run['id'], 'gap'
        artifacts = json.loads(request(base + '/actions/runs/' + str(run['id']) + '/artifacts?per_page=100', token))
        candidates = [item for item in artifacts.get('artifacts', []) if item.get('name') == 'policy-discovery' and not item.get('expired')]
        if len(candidates) > 1:
            raise ValueError('Ambiguous metadata artifact')
        for artifact in candidates:
            if artifact.get('name') != 'policy-discovery' or artifact.get('expired') or not isinstance(artifact.get('id'), int):
                continue
            if artifact.get('size_in_bytes', MAX_BYTES + 1) > MAX_BYTES:
                raise ValueError('Oversize metadata artifact')
            data = request(base + '/actions/artifacts/' + str(artifact['id']) + '/zip', token)
            files = decode_archive(data)
            return files, run['id'], 'restored' if 'policy-discovery-journal.json' in files else 'legacy_inactive_baseline'
        # Never fall back behind an attempted policy cycle: it may contain a denial.
        return {}, run['id'], 'gap'
    return {}, None, 'no_history'


def main():
    root = Path(__file__).resolve().parents[2]
    output = root / 'etl' / 'out'
    for target in (root / 'etl', output, *(output / name for name in FILES), output / 'policy-discovery-restore.json'):
        if target.is_symlink():
            raise ValueError('Symbolic metadata output')
    # A fresh runner should have no local state; do not overwrite unexplained files.
    if any((output / name).exists() for name in FILES):
        raise ValueError('Unexpected existing discovery metadata')
    output.mkdir(parents=True, exist_ok=True)
    try:
        files, run_id, status = restore(os.environ['GITHUB_REPOSITORY'], os.environ['GH_TOKEN'])
    except (urllib.error.URLError, TimeoutError):
        files, run_id, status = {}, None, 'unavailable'
    # Malformed or untrusted data fails closed; it is never silently reset.
    for name, content in files.items():
        (output / name).write_bytes(content)
    (output / 'policy-discovery-restore.json').write_text(json.dumps({'status': status, 'runId': run_id}), encoding='utf-8')
    print('Policy metadata history: ' + status + '; rolling 90 days, never a complete archive.')


if __name__ == '__main__':
    main()
