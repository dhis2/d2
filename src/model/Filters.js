import {isType} from 'd2/lib/check';
import Filter from 'd2/model/Filter';

class Filters {
    constructor(modelDefinition) {
        this.filters = [];
        this.modelDefinition = modelDefinition;
    }

    on(propertyName) {
        return Filter.getFilter(this).on(propertyName);
    }

    add(filter) {
        if (!isType(filter, Filter)) {
            throw new TypeError('filter should be an instance of Filter');
        }
        this.filters.push(filter);
    }

    list() {
        return this.modelDefinition.list();
    }

    getFilters() {
        return this.filters.map(filter => filter.getQueryParamFormat());
    }

    getReturn() {
        return this.modelDefinition;
    }

    static getFilters(modelDefinition) {
        return new Filters(modelDefinition);
    }
}

export default Filters;
