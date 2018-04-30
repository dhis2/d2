import AnalyticsResponseRowIdCombination from './AnalyticsResponseRowIdCombination';

class AnalyticsResponseRow extends Array {
    constructor(row) {
        super(...row);
    }

    getAt(index) {
        return this[index];
    }

    setIdCombination(idCombination) {
        this.idCombination = idCombination;
    }

    getNames(response, ignoreIndexes) {
        if (!this.idCombination) {
            this.setIdCombination(new AnalyticsResponseRowIdCombination(this));
        }

        return this.idCombination.getNames(response, ignoreIndexes);
    }

    toFloat(index) {
        this[index] = parseFloat(this[index]);
    }
}

export default AnalyticsResponseRow;
