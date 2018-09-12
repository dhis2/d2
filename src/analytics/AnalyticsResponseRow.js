import AnalyticsResponseRowIdCombination from './AnalyticsResponseRowIdCombination';

class AnalyticsResponseRow {
    constructor(row) {
        this.content = row;
    }

    getAt(index) {
        return this.content[index];
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
        return parseFloat(this.content[index]);
    }
}

export default AnalyticsResponseRow;
