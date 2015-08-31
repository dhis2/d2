'use strict';

import d2Init from 'd2';

describe('D2.models', function () {
    var server;
    let d2;

    beforeEach(function (done) {
        server = sinon.fakeServer.create();

        server.respondWith(
            'GET',
            '/dhis/api/schemas',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/attributes\?fields=%3Aall&paging=false$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({attributes: []})
            ]
        );

        d2Init({baseUrl: '/dhis/api'})
            .then(function (initialisedD2) {
                d2 = initialisedD2;
                done();
            });

        server.respond();
    });

    afterEach(() => {
        server.restore();
    });

    it('should be available on the d2 object', function () {
        expect(d2.models).to.not.be.undefined;
    });

    it('should have all the models', function () {
        var returnValue = function (item) { return item; };

        expect(d2.models.mapThroughDefinitions(returnValue).length).to.equal(window.fixtures.schemas.schemas.length);
    });

    it('should be able to call create on a model definition', function () {
        expect(d2.models.dataElement.create()).to.be.instanceof(Object);
    });

    it('should have the correct properties', function () {
        var dataElementModel = d2.models.dataElement.create();

        expect(dataElementModel).to.be.instanceof(d2.model.Model);
    });

    // TODO: Disabled because angular needs to be able to set additional property onto a watched object
    //it('should not be able to set any arbitrary properties', function () {
    //    var dataElementModel = d2.models.dataElement.create();
    //
    //    dataElementModel.myAmazingProperty = true;
    //
    //    expect(dataElementModel.myAmazingProperty).to.be.undefined;
    //});

    it('should be able to set properties defined by the schema', function () {
        var dataElementModel = d2.models.dataElement.create();

        dataElementModel.name = 'myDataElement';

        expect(dataElementModel.name).to.not.be.undefined;
        expect(dataElementModel.name).to.equal('myDataElement');
    });

    describe('validate', () => {
        beforeEach(() => {
            server.respondWith(
                'POST',
                '/dhis/api/schemas/dataElement',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify([])
                ]
            );
        });

        it('should return false for an empty model', (done) => {
            var dataElementModel = d2.models.dataElement.create();

            dataElementModel.validate()
                .then((validationStatus) => {
                    expect(validationStatus.status).to.be.false;
                    done();
                });

            server.respond();
        });

        describe('model with data', function () {
            var loadedDataElementModel;

            beforeEach(function (done) {
                server.respondWith(
                    'GET',
                    'http://localhost:8080/dhis/api/dataElements/umC9U5YGDq4?fields=%3Aall',
                    [
                        200,
                        {'Content-Type': 'application/json'},
                        JSON.stringify(window.fixtures.dataElements.umC9U5YGDq4)
                    ]
                );

                d2.models.dataElement.get('umC9U5YGDq4')
                    .then(function (model) {
                        loadedDataElementModel = model;
                    })
                    .then(done);

                server.respond();
            });

            it('should return true for an object from the api', function (done) {
                loadedDataElementModel.validate()
                    .then((validationStatus) => {
                        expect(validationStatus.status).to.be.true;
                    })
                    .then(done);

                server.respond();
            });

            it('should return false when a value is changed to an invalid value', function (done) {
                loadedDataElementModel.name = '';

                loadedDataElementModel.validate()
                    .then((validationStatus) => {
                        expect(validationStatus.status).to.be.false;
                        expect(validationStatus.fields).to.deep.equal(['name']);
                    })
                    .then(done);
                server.respond();
            });
            //
            //it('should have the correct incorrect fields after calling validate', function (done) {
            //    loadedDataElementModel.firstName = 'a';
            //
            //    loadedDataElementModel.validate()
            //        .then((validationStatus) => {
            //            expect(validationStatus.fields).to.deep.equal(['firstName']);
            //        })
            //        .catch(failTest)
            //        .then(done);
            //
            //    server.respond();
            //});
        });
    });

    describe('list', () => {
        beforeEach((done) => {
            server.respondWith(
                'GET',
                'http://localhost:8080/dhis/api/dataElements?fields=%3Aall&filter=id:eq:umC9U5YGDq4',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({
                        dataElements: [window.fixtures.dataElements.umC9U5YGDq4]
                    })
                ]
            );

            d2.models.dataElement
                .filter.on('id').equals('umC9U5YGDq4')
                .list()
                //.then((dataElementCollection) => modelListResult = dataElementCollection)
                .then(done);

            server.respond();
        });

        //it('', () => {
        //
        //});

        //it('should call the api with the filters', () => {
        //    server.respondWith(
        //        'GET',
        //        'http://localhost:8080/dhis/api/dataElements?fields=%3Aall&filter=id:eq:umC9U5YGDq4',
        //        [
        //            200,
        //            {'Content-Type': 'application/json'},
        //            JSON.stringify({
        //                dataElements: []
        //            })
        //        ]
        //    );
        //
        //    d2.models.dataElement
        //        .filter.on('id').equals('umC9U5YGDq4')
        //        .list()
        //        .then((list) => {
        //            expect(list.size).to.equal(0);
        //        })
        //        .then(done);
        //
        //    server.respond();
        //});
    });

    //describe('save', function () {
    //    describe('existing model', function () {
    //        var loadedModel;
    //
    //        beforeEach(function (done) {
    //            server.respondWith(
    //                'GET',
    //                'http://local/dhis/api/users/umC9U5YGDq4?fields=%3Aall%2CuserCredentials%5B%3Aowner%5D',
    //                [
    //                    200,
    //                    {'Content-Type': 'application/json'},
    //                    JSON.stringify(window.fixtures.users.VWgvyibrAq0)
    //                ]
    //            );
    //
    //            d2.models.user.get('umC9U5YGDq4')
    //                .then(function (model) {
    //                    loadedModel = model;
    //                    done();
    //                });
    //        });
    //
    //        it('should save the model to the server', function () {
    //            //TODO: Implement
    //            loadedModel.save();
    //        });
    //    });
    //});
});
