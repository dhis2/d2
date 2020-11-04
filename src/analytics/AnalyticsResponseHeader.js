class AnalyticsResponseHeader {
    constructor(
        header = {},
        options = { isPrefix: false, isCollect: false, index: undefined }
    ) {
        Object.assign(this, header, options)
    }

    getIndex() {
        return this.index
    }

    setIndex(value) {
        const index = +value

        if (!Number.isNaN(index) && Number.isFinite(index)) {
            this.index = parseInt(index, 10)
        }
    }
}

export default AnalyticsResponseHeader
