const config = require('./webpack.dev.config');

/**
 * Since both dev and prod bundles are built together, the filename needs to be different for prod.
 */
config.output.filename = 'd2-browser.min.js';

module.exports = config;
