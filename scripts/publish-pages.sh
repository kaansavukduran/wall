#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
if [[ -n "$(git status --porcelain)" ]]; then
  echo 'Publish from a clean checkout of the release commit.' >&2
  exit 1
fi
git fetch --no-tags origin main gh-pages
source_commit=$(git rev-parse HEAD)
if [[ "$source_commit" != "$(git rev-parse origin/main)" ]]; then
  echo 'The checked-out commit must match origin/main.' >&2
  exit 1
fi

previous=$(git rev-parse origin/gh-pages)
repository=$(git rev-parse --absolute-git-dir)
staging=$(mktemp -d)
trap 'rm -rf -- "$staging"' EXIT
WALL_BUILD_COMMIT="$source_commit" node scripts/build.mjs "$staging/site"
mkdir "$staging/published"
# Old HTML can remain cached. Keep the resource URLs it references available.
git archive "$previous" | tar -xf - -C "$staging/published"
cp -a "$staging/site/." "$staging/published/"
export GIT_INDEX_FILE="$staging/index"
git --git-dir="$repository" --work-tree="$staging/published" -C "$staging/published" add --all --force .
tree=$(git write-tree)
if [[ "$tree" == "$(git rev-parse "$previous^{tree}")" ]]; then
  printf 'gh-pages already contains %s\n' "$source_commit"
  exit 0
fi
published=$(git commit-tree "$tree" -p "$previous" -m "Publish WALL from $source_commit")
git push origin "$published:refs/heads/gh-pages"
printf 'Published %s to gh-pages at %s\n' "$source_commit" "$published"
