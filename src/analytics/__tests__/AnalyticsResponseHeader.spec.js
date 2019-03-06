import AnalyticsResponseHeader from '../AnalyticsResponseHeader'

let responseHeader
let expectedResponseHeader

describe('AnalyticsResponseHeader', () => {
    beforeEach(() => {
        responseHeader = new AnalyticsResponseHeader()
        expectedResponseHeader = {}
    })

    describe('constructor', () => {
        const flags = {
            isPrefix: false,
            isCollect: false,
            index: undefined,
        }

        it('should not be allowed to be called without new', () => {
            expect(() =>
                AnalyticsResponseHeader()
            ).toThrowErrorMatchingSnapshot()
        })

        it('should initialize properties', () => {
            expect(responseHeader.isPrefix).toEqual(flags.isPrefix)
            expect(responseHeader.isCollect).toEqual(flags.isCollect)
            expect(responseHeader.index).toEqual(flags.index)
        })

        it('should set the header when passed as argument', () => {
            const header = {
                name: 'cejWyOfXge6',
                column: 'Gender',
                valueType: 'TEXT',
                type: 'java.lang.String',
                hidden: false,
                meta: true,
                optionSet: 'pC3N9N77UmT',
            }

            responseHeader = new AnalyticsResponseHeader(header)

            expectedResponseHeader = { ...header, ...flags }

            Object.keys(expectedResponseHeader).forEach(key => {
                expect(responseHeader[key]).toEqual(expectedResponseHeader[key])
            })
        })
    })

    describe('properties', () => {
        describe('.setIndex()', () => {
            it('should set the index with the given value', () => {
                responseHeader.setIndex(12)

                expect(responseHeader.index).toEqual(12)
            })

            it('should set the index as numeric when passing a string', () => {
                responseHeader.setIndex('10')

                expect(responseHeader.index).toEqual(10)
            })

            it('should set the index as integer', () => {
                responseHeader.setIndex(12.5)

                expect(responseHeader.index).toEqual(12)
            })
        })

        describe('.getIndex()', () => {
            it('should return the correct index value', () => {
                responseHeader.index = 17

                expect(responseHeader.getIndex()).toEqual(17)
            })
        })
    })
})
