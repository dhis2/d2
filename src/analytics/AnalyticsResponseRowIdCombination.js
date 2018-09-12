class AnalyticsResponseRowIdCombination {
    constructor(config) {
        this.ids = Array.isArray(config) ? config.join('-') : '';
    }

    add(id) {
        if (id) {
            this.ids += (this.ids.length === 0 ? '' : '-') + id;
        }
    }

    get() {
        return this.ids;
    }

    getNames(response, ignoreIndexes) {
        let ids = this.ids.split('-');

        if (Array.isArray(ignoreIndexes)) {
            ids = ids.filter((id, index) => !ignoreIndexes.includes(index));
        }

        // XXX not sure about having to pass the response object here...
        return ids.map(id => response.getNameById(id));
    }

    getIdByIds(ids) {
        const wantedIds = Array.from(ids);

        return this.ids.split('-').find(id => wantedIds.includes(id));
    }
}

export default AnalyticsResponseRowIdCombination;
