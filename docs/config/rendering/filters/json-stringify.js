var propertiesToIgnore = [
    'fileInfo',
    'tags',
    'subDocs',
    'template',
    'outputPath',
];

function excludeUselessData(key, value) {
    if (propertiesToIgnore.indexOf(key) >= 0) {
        return undefined;
    }
    return value;
}

/**
 * @dgRenderFilter jsonStringify
 * @description Render a object as a json string
 */
module.exports = {
    name: 'jsonStringify',
    process: function(obj) {
        if (!obj) {
            return '';
        }

        return JSON.stringify(obj, excludeUselessData, 4);
    },
};