"""Pinned, bounded PDF text extraction. Input/output only; never fetch or write."""
import argparse
import base64
import io
import json
import logging
import pathlib
import sys

PINNED_VERSION = '6.21.4'
MAX_INPUT_BYTES = 13_500_000
PHASE = 'setup'


def main():
    global PHASE
    parser = argparse.ArgumentParser()
    parser.add_argument('--module-root')
    args = parser.parse_args()
    if args.module_root:
        root = pathlib.Path(args.module_root)
        if not root.is_absolute() or root.is_symlink() or not root.is_dir():
            raise ValueError('Invalid trusted module root')
        sys.path.insert(0, str(root.resolve()))
    PHASE = 'package_version'
    import pypdf
    if pypdf.__version__ != PINNED_VERSION:
        raise ValueError('Pinned PDF package version unavailable')
    logging.getLogger('pypdf').setLevel(logging.ERROR)
    PHASE = 'request_decode'
    raw = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if len(raw) > MAX_INPUT_BYTES:
        raise ValueError('Input bound exceeded')
    request = json.loads(raw)
    if not isinstance(request, dict) or set(request) != {'bytes', 'pages'}:
        raise ValueError('Invalid extraction request')
    pages = request['pages']
    if not isinstance(pages, list) or not 1 <= len(pages) <= 12 or any(type(p) is not int or p < 1 for p in pages) or pages != sorted(set(pages)):
        raise ValueError('Invalid page selection')
    data = base64.b64decode(request['bytes'], validate=True)
    if not 0 < len(data) <= 10_000_000 or not data.startswith(b'%PDF-'):
        raise ValueError('Invalid bounded PDF bytes')
    PHASE = 'pdf_parse'
    reader = pypdf.PdfReader(io.BytesIO(data), strict=True)
    if reader.is_encrypted:
        # PdfReader may open a public document with an empty user password on
        # construction. Never try passwords or override the extraction flag.
        PHASE = 'public_copy_permission'
        import cryptography
        from pypdf.constants import UserAccessPermissions
        if cryptography.__version__ != '48.0.0' or reader.user_access_permissions is None or not (reader.user_access_permissions & UserAccessPermissions.EXTRACT):
            raise ValueError('Pinned crypto or public extraction permission absent')
    if len(reader.pages) > 2000 or pages[-1] > len(reader.pages):
        raise ValueError('Unreviewed page range')
    PHASE = 'page_extract'
    result = [{'page': p, 'text': reader.pages[p - 1].extract_text() or ''} for p in pages]
    output = json.dumps({'engine': 'pypdf', 'version': PINNED_VERSION, 'pages': result}, ensure_ascii=True).encode('utf-8')
    PHASE = 'output_bound'
    if len(output) > 1_000_000:
        raise ValueError('Text output bound exceeded')
    sys.stdout.buffer.write(output)


if __name__ == '__main__':
    try:
        main()
    except Exception:
        # Original text, PDF internals and local configuration stay out of logs.
        sys.stderr.write('PDF_REVIEW_REJECTED:' + PHASE + '\n')
        raise SystemExit(2)
