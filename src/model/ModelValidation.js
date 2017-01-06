import { checkType } from '../lib/check';
import Logger from '../logger/Logger';
import Api from '../api/Api';
import { getOwnedPropertyJSON } from './helpers/json';

/**
 * @class ModelValidation
 */
class ModelValidation {
    constructor(providedLogger) {
        checkType(providedLogger, 'object', 'logger (Logger)');
        this.logger = providedLogger;
    }

    /**
     * @deprecated
     * @method validate
     *
     * @returns {{status: boolean, messages: Array}} Returns {status: true, messages: []}
     */
    validate() {
        this.logger.warn('Client side model validation is deprecated');
        throw new Error('Client side model validation is deprecated');
    }

    /**
     * @method validateAgainstSchema
     *
     * @param {Model} model The model that should be validated.
     * @returns {Array} Returns an array with validation messages if there are any.
     *
     * @description
     * Sends a POST request against the `api/schemas` endpoint to check if the model is valid.
     *
     * @note {warn} Currently only checks
     */
    validateAgainstSchema(model) {
        if (!(model && model.modelDefinition && model.modelDefinition.name)) {
            return Promise.reject('model.modelDefinition.name can not be found');
        }

        function extractValidationViolations(webmessage) {
            if (webmessage.response && webmessage.response.errorReports) {
                return webmessage.response.errorReports;
            }
            throw new Error('Response was not a WebMessage with the expected format');
        }

        const url = `schemas/${model.modelDefinition.name}`;

        // TODO: The function getOwnedPropertyJSON should probably not be exposed, perhaps we could have a getJSONForModel(ownedPropertiesOnly=true) method.
        return Api.getApi().post(url, getOwnedPropertyJSON(model))
            .catch(e => Promise.reject(e))
            .then((webMessage) => {
                if (webMessage.status === 'OK') {
                    return [];
                }
                return Promise.reject(webMessage);
            })
            .catch(extractValidationViolations);
    }

    /**
     * @method getModelValidation
     * @static
     *
     * @returns {ModelValidation} New or memoized instance of `ModelInstance`
     *
     * @description
     * Returns the `ModelValidation` singleton. Creates a new one if it does not yet exist.
     * Grabs a logger instance by calling `Logger.getLogger`
     */
    static getModelValidation() {
        if (this.modelValidation) {
            return this.modelValidation;
        }
        return (this.modelValidation = new ModelValidation(Logger.getLogger(console)));
    }
}

export default ModelValidation;
