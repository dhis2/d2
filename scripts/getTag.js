#!/usr/bin/env node
const package = require('../package.json');

process.stdin.setEncoding('utf-8');
process.stdin.on('data', function (data) {
  const info = eval(`true && ${data}`);

  getDeploymentInfoFromNpm(info);
});

function getDeploymentInfoFromNpm(info) {
  console.log(info['dist-tags']);

  const isAlreadyDeployed = info.versions.some(deployed => deployed === package.version);

  console.log(isAlreadyDeployed ? 'Not new' : 'new');
}