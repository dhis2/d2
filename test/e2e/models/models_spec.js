describe('D2.models', function () {
    var server;
    var d2;

    beforeEach(function (done) {
        System.import('d2')
            .then(function (require) {
                server = sinon.fakeServer.create();
                server.autoRespond = true;

                server.respondWith(
                    'GET',
                    '/dhis/api/schemas',
                    [
                        200,
                        {'Content-Type': 'application/json'},
                        JSON.stringify(window.fixtures.schemas)
                    ]
                );

                require.default({baseUrl: '/dhis/api'})
                    .then(function (initialisedD2) {
                        d2 = initialisedD2;
                        done();
                    });
            });
    });

    it('should be available on the d2 object', function () {
        expect(d2.models).to.be.defined;
    });

    it('should have all the models', function () {
        var returnValue = function (item) { return item; };

        expect(d2.models.mapThroughDefinitions(returnValue).length).to.equal(61);
    });

    it('should be able to call create on a model definition', function () {
        expect(d2.models.dataElement.create()).to.be.instanceof(Object);
    });

    it('should have the correct properties', function () {
        var dataElementModel = d2.models.dataElement.create();

        expect(dataElementModel).to.be.instanceof(d2.model.Model);
        expect(Object.isSealed(dataElementModel)).to.be.true;
    });

    it('should not be able to set any arbitrary properties', function () {
        var dataElementModel = d2.models.dataElement.create();

        dataElementModel.myAmazingProperty = true;

        expect(dataElementModel.myAmazingProperty).to.be.undefined;
    });

    it('should be able to set properties defined by the schema', function () {
        var dataElementModel = d2.models.dataElement.create();

        dataElementModel.name = 'myDataElement';

        expect(dataElementModel.name).to.be.defined;
        expect(dataElementModel.name).to.equal('myDataElement');
    });
});