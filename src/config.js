import defaultConfig from 'd2/defaultConfig';
import {isType, isString} from 'd2/lib/check';

export default class Config {
    static create(...args) {
        const configObjects = args
            .filter(arg => arg);

        if (!configObjects.every(configObject => isType(configObject, 'object'))) {
            throw new Error('Expected Config parameter to have type object');
        }

        return Object.assign({}, defaultConfig, ...args);
    }

    static processConfigForD2(config, d2) {
        const api = d2.Api.getApi();
        d2.model.ModelDefinition.prototype.api = api;
        d2.models = new d2.model.ModelDefinitions();

        if (isString(config.baseUrl)) {
            api.setBaseUrl(config.baseUrl);
        } else {
            api.setBaseUrl('/api');
        }

        if (config.i18n && config.i18n.sources) {
            Array.from(config.i18n.sources)
                .forEach(source => d2.i18n.addSource(source));
        }
    }
}
