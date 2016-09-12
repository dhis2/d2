import {init, getInstance} from '../../../src/d2';

describe('D2.models', () => {
    var server;
    let d2;

    beforeEach(done => {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        // Show the requests made to the fake server.
        // server.xhr.addFilter(function (method, url) {
        //    console.log(method, url);
        //    return false;
        // });

        server.respondWith(/(.*)/, (rq) => {
            console.error(`D2.models 404: '${rq.method}', '${rq.url}'`);
        });

        server.respondWith(
            'GET',
            '/dhis/api/schemas?fields=apiEndpoint,name,authorities,singular,plural,shareable,metadata,klass,identifiableObject,properties%5Bhref,writable,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner,itemPropertyType%5D',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.schemas)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/schemas/dataElement?fields=apiEndpoint,name,authorities,plural,sharable,metadata,klass,identifiableObject,properties[href,writable,referenceType,collection,collectionName,name,propertyType,persisted,required,min,max,ordered,unique,constants,owner]',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(window.fixtures.dataElementSchema)
            ]
        );

        server.respondWith(
            'GET',
            '/dhis/api/attributes?fields=:all,optionSet%5B:all,options%5B:all%5D%5D&paging=false',
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
            '/dhis/api/me?fields=:all,organisationUnits%5Bid%5D,userGroups%5Bid%5D,userCredentials%5B:all,!user,userRoles%5Bid%5D',
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({})
            ]
        );

        server.respondWith(
            'GET',
            /^\/dhis\/api\/userSettings$/,
            [
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify({
                    "keyDbLocale": "en",
                    "keyMessageSmsNotification": true,
                    "keyTrackerDashboardLayout": null,
                    "keyStyle": "light_blue/light_blue.css",
                    "keyAutoSaveDataEntryForm": false,
                    "keyUiLocale": "fr",
                    "keyAutoSavetTrackedEntityForm": false,
                    "keyAnalysisDisplayProperty": "name",
                    "keyAutoSaveCaseEntryForm": false,
                    "keyMessageEmailNotification": true
                })
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

        server.respondWith(
            'GET',
            '/dhis/api/me?fields=:all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id]',
            [
                200,
                {'Content-Type': 'text/plain'},
                '{}'
            ]
        );

        server.respondWith(() => {
            [
                404,
                {'Content-Type': 'text/plain'},
                'Resource not found'
            ]
        });

        init({ baseUrl: '/dhis/api' })
            .then(d2instance => {
                d2 = d2instance;
                done();
            })
            .catch(done);
    });

    afterEach(() => {
        server.restore();
    });

    it('should be available on the d2 object', () => {
        expect(d2.models).to.not.be.undefined;
    });

    it('should have all the models', () => {
        var returnValue = function (item) { return item; };

        expect(d2.models.mapThroughDefinitions(returnValue).length).to.equal(window.fixtures.schemas.schemas.length);
    });

    it('should be able to call create on a model definition', () => {
        expect(d2.models.dataElement.create()).to.be.instanceof(Object);
    });

    it('should have the correct properties', () => {
        var dataElementModel = d2.models.dataElement.create();

        expect(dataElementModel).to.be.instanceof(d2.model.Model);
    });

    it('should be able to set properties defined by the schema', () => {
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
                        'httpStatus': 'OK',
                        'httpStatusCode': 200,
                        'status': 'OK',
                        'response': {
                            'responseType': 'ValidationViolations',
                        },
                    }),
                ]
            );
        });

        afterEach(() => {
            server.restore();
        });

        it('should return false for an empty model', (done) => {
            var dataElementModel = d2.models.dataElement.create();
            server.respondWith(
                'POST',
                '/dhis/api/schemas/dataElement',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({
                        "httpStatus": "Conflict",
                        "httpStatusCode": 409,
                        "status": "WARNING",
                        "message": "One more more errors occurred, please see full details in import report.",
                        "response": {
                            "responseType": "ObjectReport",
                            "uid": "m9jMnTWsTD5",
                            "klass": "org.hisp.dhis.dataelement.DataElement",
                            "errorReports": [
                                {
                                    "message": "Missing required property `aggregationType`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "org.hisp.dhis.analytics.AggregationType",
                                    "errorCode": "E4000"
                                },
                                {
                                    "message": "Missing required property `domainType`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "org.hisp.dhis.dataelement.DataElementDomain",
                                    "errorCode": "E4000"
                                },
                                {
                                    "message": "Missing required property `categoryCombo`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "org.hisp.dhis.dataelement.DataElementCategoryCombo",
                                    "errorCode": "E4000"
                                },
                                {
                                    "message": "Missing required property `valueType`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "org.hisp.dhis.common.ValueType",
                                    "errorCode": "E4000"
                                },
                                {
                                    "message": "Missing required property `name`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "java.lang.String",
                                    "errorCode": "E4000"
                                },
                                {
                                    "message": "Missing required property `shortName`.",
                                    "mainKlass": "org.hisp.dhis.dataelement.DataElement",
                                    "errorKlass": "java.lang.String",
                                    "errorCode": "E4000"
                                }
                            ]
                        }
                    }),
                ]
            );

            dataElementModel.validate()
                .then((validationStatus) => {
                    expect(validationStatus.status).to.be.false;
                    done();
                })
                .catch(done);

            server.respond();
        });

        describe('model with data', () => {
            var loadedDataElementModel;

            beforeEach(function (done) {
                server.respondWith(
                    'GET',
                    'http://localhost:8080/dhis/api/dataElements/umC9U5YGDq4?fields=:all,attributeValues%5B:all,attribute%5Bid,name,displayName%5D%5D',
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
                    .then(done, done);

                server.respond();
            });

            afterEach(() => {
                server.restore();
            });

            it('should return true for an object from the api', function (done) {
                loadedDataElementModel.validate()
                    .then((validationStatus) => {
                        expect(validationStatus.status).to.be.true;
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
                'http://localhost:8080/dhis/api/dataElements?fields=:all',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({dataElements: [window.fixtures.dataElements.umC9U5YGDq4]})
                ]
            );

            server.respondWith(
                'GET',
                'http://localhost:8080/dhis/api/dataElements?filter=id:eq:umC9U5YGDq4&fields=:all',
                [
                    200,
                    {'Content-Type': 'application/json'},
                    '{"dataElements": []}'
                ]
            );
        });

        afterEach(() => {
            server.restore();
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
                    done();
                })
                .catch((err) => {
                    done('Error:' + err);
                })
            ;

            server.respond();
        });
    });

    describe('save', () => {
        describe('existing model', () => {
            var loadedModel;

            beforeEach(function (done) {
                server.respondWith(
                    'GET',
                    'http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=:all,userCredentials%5B:owner%5D',
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
                    'http://localhost:8080/dhis/api/users/VWgvyibrAq0?mergeStrategy=REPLACE',
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
                    .then(() => {
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
                'http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=:all,userCredentials%5B:owner%5D',
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
