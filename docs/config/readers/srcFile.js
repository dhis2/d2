var _ = require('lodash');
var esprima = require('esprima');
var babel = require('babel');

/**
 * @dgService srcFileFileReader
 * @description
 * This file reader will transform the es6 based sourcefile into a es5 sourcefile
 */
module.exports = function srcFileFileReader(log) {
    var reader = {
        name: 'srcFileFileReader',
        defaultPattern: /\.js$/,
        getDocs: function(fileInfo) {
            try {
                log.debug('Transpile sourcefile to ES5');
                fileInfo.content = babel.transform(fileInfo.content, {sourceMap: false, modules: 'ignore'}).code;

                fileInfo.ast = esprima.parse(fileInfo.content, {
                    loc: true,
                    attachComment: true
                });
            } catch(ex) {
                ex.file = fileInfo.filePath;
                throw new Error(
                    _.template('JavaScript error in file "${file}"" [line ${lineNumber}, column ${column}]: "${description}"', ex));
            }

            return [{
                docType: 'jsFile'
            }];
        }
    };

    return reader;
};
