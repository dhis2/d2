global.chai = require('chai');
global.sinon = require('sinon');

// Chai plugins
global.chai.use(require('sinon-chai'));
global.chai.use(require('chai-as-promised'));

global.expect = global.chai.expect;

// fetch for node
global.fetch = require('node-fetch');
global.Headers = fetch.Headers;

process.on('unhandledRejection', (reason, p) => {
    const e = new Error();
    console.log('\n\n================================================');
    console.log('Somebody made a boo-boo and forgot to clean up at:', p, 'Because:', reason);
    console.log('================================================\n');
});
