'use strict';

import {checkType} from '../lib/check';

class ModelDefinitions {
    add(modelDefinition) {
        try {
            checkType(modelDefinition.name, 'string');
        } catch (e) {
            throw new Error('Name should be set on the passed ModelDefinition to add one');
        }

        if (this[modelDefinition.name]) {
            throw new Error(['Model', modelDefinition.name, 'already exists'].join(' '));
        }
        this[modelDefinition.name] = modelDefinition;
    }

    mapThroughDefinitions(transformer) {
        var modelDefinition;
        var result = [];

        for (modelDefinition in this) {
            if (this.hasOwnProperty(modelDefinition)) {
                result.push(transformer(this[modelDefinition]));
            }
        }

        return result;
    }
}

export default ModelDefinitions;
