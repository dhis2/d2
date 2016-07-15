const PULL_REQUEST_VALIDATION = 'pull-request-validation';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const shell = require('shelljs');
const { compose, head, split, some, isEqual, get, replace, contains, filter, includes, slice, tail, takeRight, memoize} = require('lodash/fp');
const package = require('../package.json');
const fetch = require('node-fetch');

// Utility functions
const exec = (cmd) => shell.exec(cmd, {silent:true}).stdout;
const getGitLogForRemoteBranch = (branchName) => exec(`git --no-pager log --pretty=oneline -n1 origin/${branchName}`);
const getCommitHashLastCommit = compose(head, split(' '));
const getCommitHashLastCommitOnRemoteForCurrentVersion = (branchName) => compose(getCommitHashLastCommit, getGitLogForRemoteBranch)(branchName);
const isCHANGELOGUpdated = memoize((branchName) => compose(some(isEqual('CHANGELOG.md')), split('\n'))(exec(`git --no-pager diff --name-only ^HEAD origin/${branchName}`)));
const getRemotePackageJson = (branchName) => JSON.parse(exec(`git show origin/${branchName}:package.json`));
const getRemoteVersion = (branchName) => get('version', getRemotePackageJson(branchName));
const buildVersionObject = (versionArray) => ({ major: versionArray[0], minor: versionArray[1], patch: versionArray[2] });
const parseVersion = compose(buildVersionObject, split('.'));
const isUpdatedVersion = (...args) => !isEqual(...args);
const logStatus = (message) => console.log(`STATUS: ${message}`);
const getCurrentHash = () => getCommitHashLastCommit(exec('git --no-pager log --pretty=oneline -n1'));
const getOriginInfo = () => exec('git remote show -n origin');
const gitFetch = () => exec('git fetch');
const identityWithLog = (v) => {
    console.log(v);
    return v;
}
const getGitLocationParts = () => compose(takeRight(2), split('/'), replace('.git', ''), tail, split(':'), head, filter(includes('Push')), split('\n'))(getOriginInfo());
const parseRemoteVersion = compose(parseVersion, getRemoteVersion);
const isValidPullRequest = (branchName, local, remote) => isCHANGELOGUpdated(branchName) && isUpdatedVersion(local, remote);
function getValidationMessage(branchName, local, remote) {
    const versionStatusMessage = 'The `version` property in the package.json needs to be updated with your pull request.';
    const changeLogStatusMessage = 'CHANGELOG.md needs to be updated with your pull request.'

    if (isValidPullRequest(branchName, local, remote)) {
        return "Pull request is valid!";
    }

    if (!isUpdatedVersion(local, remote)) {
        return versionStatusMessage;
    }

    if (!isCHANGELOGUpdated(branchName)) {
        return changeLogStatusMessage;
    }
}

function saveStatusToGithub(status) {
    const [owner, repo] = getGitLocationParts();
    // POST /repos/:owner/:repo/statuses/:sha
    const statusUrl = `https://api.github.com/repos/${owner}/${repo}/statuses/${getCurrentHash()}`;

    if (!GITHUB_TOKEN) {
        return Promise.reject(new Error('GITHUB_TOKEN not available.'));
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(status),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${GITHUB_TOKEN}`,
        },
    };

    return fetch(statusUrl, options);
}

function getStatus(branchName, local, remote) {
    return {
        "state": isValidPullRequest(branchName, local, remote) ? 'success' : 'failure',
        "description": getValidationMessage(branchName, local, remote),
        "context": PULL_REQUEST_VALIDATION,
    };
};

module.exports = {
    parseRemoteVersion,
    parseVersion,
    logStatus,
    getGitLocationParts,
    isCHANGELOGUpdated,
    isUpdatedVersion,
    isValidPullRequest,
    getValidationMessage,
    gitFetch,
    getStatus,
    saveStatusToGithub,
    PULL_REQUEST_VALIDATION,
};