#!/bin/bash
set -e

git config user.name "Travis CI"
git config user.email "mark@dhis2.org"
npm version patch && npm run build
git push https://${GITHUB_TOKEN}@${GH_REF} HEAD:$TRAVIS_BRANCH --quiet
git push https://${GITHUB_TOKEN}@${GH_REF} --tags --quiet
