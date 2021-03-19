import AnalyticsRequestBase from '../AnalyticsRequestBase'

const endPoint = 'foo'
const path = 'bar'
const program = 'census'
const format = 'json'

const basePath = `${endPoint}/${path}/${program}.${format}`
const dimensions = [
    { dimension: 'ou', items: ['mars', 'earth'] },
    { dimension: 'dx', items: ['population'] },
    { dimension: 'question' },
    { dimension: 'answer', items: ['42'] },
    { dimension: 'space', items: ['in between'] },
]
const buildRequest = overrides => {
    return new AnalyticsRequestBase({
        endPoint,
        path,
        program,
        format,
        parameters: {
            foo: 'bar',
        },
        ...overrides,
    })
}

describe('AnalyticsRequestBase', () => {
    it('Should build a URL of dimension parameters', () => {
        const request = buildRequest({ dimensions })
        const url = request.buildUrl()
        expect(url).toBe(
            `${basePath}?dimension=ou:mars;earth&dimension=dx:population&dimension=question&dimension=answer:42&dimension=space:in between`
        )
    })

    it('Should build a URL with sorted dimension parameters when options.sorted=true', () => {
        const request = buildRequest({ dimensions })
        const url = request.buildUrl({ sorted: true })
        expect(url).toBe(
            `${basePath}?dimension=answer:42&dimension=dx:population&dimension=ou:earth;mars&dimension=question&dimension=space:in between`
        )
    })

    it('Should not choke on a null or empty filter array', () => {
        const request = buildRequest()
        const query = request.buildQuery()
        expect(query).toMatchObject({
            foo: 'bar',
        })

        const request2 = buildRequest({ filters: [] })
        const query2 = request2.buildQuery()
        expect(query2).toMatchObject({
            foo: 'bar',
        })
    })

    it('Should build a query with filter parameters', () => {
        const request = buildRequest({ filters: dimensions })
        const query = request.buildQuery()
        expect(query).toMatchObject({
            foo: 'bar',
            filter: [
                'ou:mars;earth',
                'dx:population',
                'question',
                'answer:42',
                'space:in between',
            ],
        })
    })

    it('Should build a query with sorted filter parameters when options.sorted=true', () => {
        const request = buildRequest({ filters: dimensions })
        const query = request.buildQuery({ sorted: true })
        expect(query).toMatchObject({
            foo: 'bar',
            filter: [
                'answer:42',
                'dx:population',
                'ou:earth;mars',
                'question',
                'space:in between',
            ],
        })
    })
})
