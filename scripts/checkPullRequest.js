#!/usr/bin/env node

const package = require('../package.json');
const {
    parseRemoteVersion,
    parseVersion,
    logStatus,
    gitFetch,
    getStatus,
    saveStatusToGithub,
    PULL_REQUEST_VALIDATION,
} = require('./utils');

console.log('');

// Update the local git cache
gitFetch();

// Update the status of the validation to `pending` on github
const pendingStatus = {
    state: 'pending',
    description: 'Validating your pull request',
    constext: PULL_REQUEST_VALIDATION,
};

saveStatusToGithub(pendingStatus)
    .then(() => {
        const local = parseVersion(package.version); // Get local version from package.json
        const branchName = `v${local.major}`; // Branch name for the prod version is always the letter v and the major version (e.g. v24)
        const remote = parseRemoteVersion(branchName); // Get version from the remote package.json

        logStatus(getStatus(branchName, local, remote).description);

        return saveStatusToGithub(getStatus(branchName, local, remote).description);
    })
    .then(() => {
        logStatus('Pull request status saved');
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });


// exec('npm run build');

// TODO
// Create git tag
// Publish to npm
// Set correct dist tag

/**
read npmTag packageVersion

set -e

echo $packageVersion;

d2version="d2@$packageVersion";

echo $npmTag
echo $d2version

npm publish
npm dist-tags add $d2version $npmTag
 */