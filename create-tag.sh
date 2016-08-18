#!/bin/bash
set -e

# Usage:
# Pipe the result of g --no-pager d <commit>..<commit> --name-only into this script
# For travis a commit range can be used TRAVIS_COMMIT_RANGE
# TODO: Might not work on first commit as there is not commit range there.

if [ -n "${TRAVIS_TAG}" ]; then
    echo "Building a tag, so not creating one!";
    exit 0;
fi

# Flag to keep track of if we need to create a tag
isCreateTag=false

# Check if the one of the files in the diff is in the src directory
while IFS=$'\n' read fileName; do
    echo $fileName
    if [[ $fileName == src\/* ]]; then
        isCreateTag=true
    fi
done

if [[ $isCreateTag == true ]]; then
    echo "Tagging!";
    git config user.name "Travis CI"
    git config user.email "mark@dhis2.org"
    npm version patch && npm run build
    git push --quiet https://${GITHUB_TOKEN}@${GH_REF} HEAD:$TRAVIS_BRANCH > /dev/null 2>&1
    git push --quiet https://${GITHUB_TOKEN}@${GH_REF} --tags > /dev/null 2>&1
else
    echo "No tag";
fi
