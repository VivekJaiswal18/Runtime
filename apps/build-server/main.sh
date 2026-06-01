#!/bin/sh

set -e 

export GIT_REPOSITORY_LINK="$GIT_REPOSITORY_LINK"

case "$GIT_REPOSITORY_LINK" in
    https://github.com/*|https://gitlab.com/*)
    ;;
    *)
    echo "ERROR: Invalid or unsupported repository link"
    exit 1
    ;;
esac

echo "Cloning repository.."
git clone --branch "$BRANCH" "$GIT_REPOSITORY_LINK" /home/app/output

# npx tsc || exit 1
exec node /home/app/apps/build-server/dist/build-runner.js