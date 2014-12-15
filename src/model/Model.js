(function (d2) {
    'use strict';

    d2.Model = Model;

    function Model() {

    }
    Model.create = function (modelDefinition) {
        var model = new Model();

        //Values object used to store the actual model values
        Object.defineProperty(model, 'dataValues', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: {}
        });

        Object.keys((modelDefinition && modelDefinition.modelProperties) || {})
            .forEach(function (propertyName) {
                Object.defineProperty(model, propertyName,
                    createPropertyDescriptor(propertyName, modelDefinition.modelProperties[propertyName]));
            });

        return model;
    };

    function createPropertyDescriptor(name, options) {
        var propertyDescriptor = {
            enumerable: true,
            configurable: false,
            get: function () {
                return this.dataValues[name];
            }
        };

        if (options && options.writable === true) {
            propertyDescriptor.set = function (value) {
                this.dataValues[name] = value;
            };
        }
        //return {};
        return propertyDescriptor;
    }

    Model.prototype = new d2.ModelBase(); //jshint nonew:false
})(window.d2 = window.d2 || {});
