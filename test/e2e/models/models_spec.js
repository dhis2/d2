var beforeAll = jasmineRequire.interface(jasmine, jasmine.getEnv()).beforeAll;

describe('D2.models', function () {
    var modelObjects;
    var models;
    var server;

    beforeAll(function (done) {
        server = sinon.fakeServer.create();
        server.autoRespond = true;

        server.respondWith(
            'GET',
            '/dhis/api/schemas',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(fixtures.get('/api/schemas'))
            ]
        );

        window.d2({baseUrl: '/dhis/api'})
            .then(function (d2) {
                modelObjects = d2.model;
                models = d2.models;
                done();
            });
    });

    beforeEach(function () {
    });

    it('should be available on the d2 object', function () {
        expect(models).toBeDefined();
    });

    it('should have all the models', function () {
        var returnValue = function (item) { return item; };

        expect(models.mapThroughDefinitions(returnValue).length).toBe(60);
    });

    it('should be able to call create on a model definition', function () {
        expect(models.dataElement.create()).toEqual(jasmine.any(Object));
    });

    it('should have the correct properties', function () {
        var dataElementModel = models.dataElement.create();

        expect(dataElementModel).toEqual(jasmine.any(modelObjects.Model));
        expect(Object.isSealed(dataElementModel)).toBe(true);
    });

    it('should not be able to set any arbitrary properties', function () {
        var dataElementModel = models.dataElement.create();

        dataElementModel.myAmazingProperty = true;

        expect(dataElementModel.myAmazingProperty).not.toBeDefined();
    });

    it('should be able to set properties defined by the schema', function () {
        var dataElementModel = models.dataElement.create();

        dataElementModel.name = 'myDataElement';

        expect(dataElementModel.name).toBeDefined();
        expect(dataElementModel.name).toEqual('myDataElement');
    });
});