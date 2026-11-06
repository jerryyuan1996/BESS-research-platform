#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# PUSH THE BOT'S COMMITS TO MAIN, REBASING IF MAIN MOVED DURING THE RUN.
#
# A data run takes minutes, and a merge can land on main in the meantime. The
# plain `git push` was then rejected ("fetch first") and the run failed with
# the data fetched, validated and committed, but never published.
#
# The bot's commits touch only public/data/ and the view store, so replaying
# them on top of the newer main is a fast-forward of different files. If it is
# not — a human commit changed the same snapshot or view file — the rebase is
# abandoned and the job fails loudly: nothing is pushed, nothing is merged by
# guesswork, and the next run starts from the new main.
#
# The publish job tests the commit this pushes, including whatever landed
# underneath it, so the rebased result is never published untested.
#
# Prints nothing to $GITHUB_OUTPUT: the caller records the SHA after this
# returns, so a SHA is only ever recorded for a commit that is on the remote.
# ---------------------------------------------------------------------------
set -euo pipefail

attempts=${PUSH_ATTEMPTS:-4}
for attempt in $(seq 1 "$attempts"); do
  if git push origin HEAD:main; then
    exit 0
  fi
  if [ "$attempt" -eq "$attempts" ]; then
    break
  fi
  echo "::warning::main moved during this run; rebasing onto the latest main (attempt $attempt of $attempts)."
  git fetch --quiet origin main
  if ! git rebase FETCH_HEAD; then
    git rebase --abort || true
    echo "::error::The bot's commit conflicts with a change that landed on main during this run. Nothing was pushed; the next run starts from the new main."
    git status --short || true
    exit 1
  fi
  sleep $((attempt * 5))
done
echo "::error::Could not push to main after $attempts attempts."
exit 1
