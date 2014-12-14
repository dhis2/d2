(function (d2) {
    d2. ModelDefinitions = ModelDefinitions;

    function ModelDefinitions() {
        this.add = add;
    }

    function add(name) {
        if (this[name]) {
            throw new Error(['Model', name, 'already exists'].join(' '));
        }
        this[name] = {};
    }

})(window.d2 = window.d2 || {});
