global.chai = require('chai');
global.sinon = require('sinon');

// Chai plugins
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-as-promised'));

global.expect = global.chai.expect;

// fetch and FormData for node
global.fetch = require('node-fetch');
global.Headers = fetch.Headers;
global.FormData = require('form-data');

require('./setup-d2-init-requests.js');
