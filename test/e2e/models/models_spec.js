import {init, getInstance} from '../../../src/d2';

describe('D2.models', function () {
    var server;
    let d2;

    beforeEach(function (done) {
        server = sinon.fakeServer.create();
        server.xhr.useFilters = true;

        // Show the requests made to the fake server.
        // server.xhr.addFilter(function (method, url) {
        //     console.log(method, url);
        //     return false;
        // });

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
            /^\/dhis\/api\/attributes\?fields=%3Aall%2CoptionSet%5B%3Aall%2Coptions%5B%3Aall%5D%5D&paging=false$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({attributes: []})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\/authorization$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify([])
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/me\?fields=%3Aall%2CorganisationUnits%5Bid%5D%2CuserGroups%5Bid%5D%2CuserCredentials%5B%3Aall%2C!user%2CuserRoles%5Bid%5D$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/system\/info$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({version: '2.21'})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/apps$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({apps: []})
            ]
        );

        init({baseUrl: '/dhis/api'});
        getInstance()
            .then(function (initialisedD2) {
                d2 = initialisedD2;
                done();
            })
            .catch(done);

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
                    JSON.stringify({
                        "httpStatus": "OK",
                        "httpStatusCode": 200,
                        "status": "OK",
                        "response": {
                            "responseType": "ValidationViolations"
                        }
                    })
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
                    'http://localhost:8080/dhis/api/dataElements/umC9U5YGDq4?fields=%3Aall%2CattributeValues%5B%3Aall%2Cattribute%5Bid%2Cname%2CdisplayName%5D%5D',
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
        });
    });

    // TODO: Stringify doesn't work because it has some sort of cyclic structure. Probably some polyfill that modifies base objects
    describe('list', () => {
        beforeEach(() => {
            server.respondWith(
                'GET',
                'http://localhost:8080/dhis/api/dataElements?fields=%3Aall',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({dataElements: [window.fixtures.dataElements.umC9U5YGDq4]})
                ]
            );

            server.respondWith(
                'GET',
                'http://localhost:8080/dhis/api/dataElements?filter=id:eq:umC9U5YGDq4&fields=%3Aall',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    '{"dataElements": []}'
                ]
            );
        });

        it('should load a list of dataElements from the server', (done) => {
            d2.models.dataElement
                .list()
                .then(function (modelCollection) {
                    expect(modelCollection.size).to.equal(1);
                    expect(modelCollection.toArray()[0].id).to.equal('umC9U5YGDq4');
                    done();
                });

            server.respond();
        });

        it('should call the api with the filters', (done) => {
            d2.models.dataElement
                .filter()
                .on('id').equals('umC9U5YGDq4')
                .list()
                .then((list) => {
                    expect(list.size).to.equal(0);
                })
                .then(done)
                .catch((err) => {
                    done(err);
                })
            ;

            server.respond();
        });
    });

    describe('save', function () {
        describe('existing model', function () {
            var loadedModel;

            beforeEach(function (done) {
                server.respondWith(
                    'GET',
                    'http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=%3Aall%2CuserCredentials%5B%3Aowner%5D',
                    [
                        200,
                        {'Content-Type': 'application/json'},
                        JSON.stringify(window.fixtures.users.VWgvyibrAq0)
                    ]
                );

                server.respondWith(
                    '/dhis/api/schemas/user',
                    [
                        200,
                        {'Content-Type': 'application/json'},
                        JSON.stringify({
                            "httpStatus": "OK",
                            "httpStatusCode": 200,
                            "status": "OK",
                            "response": {
                                "responseType": "ValidationViolations"
                            }
                        })
                    ]
                );

                server.respondWith(
                    'PUT',
                    'http://localhost:8080/dhis/api/users/VWgvyibrAq0',
                    [
                        200,
                        {'Content-Type': 'application/json'},
                        JSON.stringify({
                            response: {
                                importCount: {

                                }
                            }
                        })
                    ]
                );

                d2.models.user.get('VWgvyibrAq0')
                    .then(function (model) {
                        loadedModel = model;
                        done();
                    })
                    .catch(done);

                server.respond();
            });

            it('should save not save the model if there were no changes', function (done) {
                loadedModel.save()
                    .catch(function (e) {
                        expect(e).to.equal('No changes to be saved');
                        done();
                    });
            });

            it('should save the model when a property was changed', (done) => {
                loadedModel.firstName = 'Mark';

                loadedModel.save()
                    .then(function () {
                        done();
                    })
                    .catch(done);

                //Respond to validation against schema
                server.respond();
                //Respond to PUT request on next event loop
                setTimeout(() => server.respond());
            });
        });
    });

    describe('delete', () => {
        var loadedModel;

        beforeEach(function (done) {
            server.respondWith(
                'GET',
                'http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=%3Aall%2CuserCredentials%5B%3Aowner%5D',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify(window.fixtures.users.VWgvyibrAq0)
                ]
            );

            server.respondWith(
                'DELETE',
                'http://localhost:8080/dhis/api/users/VWgvyibrAq0',
                [
                    204,
                    {'Content-Type': 'application/json'},
                    ''
                ]
            );

            d2.models.user.get('VWgvyibrAq0')
                .then(function (model) {
                    loadedModel = model;
                    done();
                });

            server.respond();
        });

        it('should call the api to delete the model', (done) => {
            loadedModel.delete()
                .then(() => {
                    done();
                });

            server.respond();
        });

        it('should fail when the resource does not exist', (done) => {
            server.respondWith(
                'DELETE',
                'http://localhost:8080/dhis/api/users/VWgvyibrAq0',
                [
                    404,
                    {'Content-Type': 'application/json'},
                    '{"message": "Resource does not exist"}'
                ]
            );

            loadedModel.delete()
                .catch(() => {
                    done();
                });

            server.respond();
        });
    });
});
