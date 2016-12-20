import {init, getInstance} from '../../../src/d2';
import { respondTo, createFetchMock } from '../../setup/fetch-mock';
import { createSpies } from '../../setup/setup-d2-init-requests';

describe('D2.models', () => {
    var server;
    let d2;

    beforeEach(done => {
        createFetchMock();
        createSpies();

        init({ baseUrl: '/dhis/api' })
            .then(d2instance => {
                d2 = d2instance;
                done();
            })
            .catch(done);
    });

    afterEach(() => {
        window.fetch.restore();
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
            respondTo('/dhis/api/schemas/dataElement', 'POST')
                .with(JSON.stringify({
                        'httpStatus': 'OK',
                        'httpStatusCode': 200,
                        'status': 'OK',
                        'response': {
                            'responseType': 'ValidationViolations',
                        },
                    }));
        });

        it('should return false for an empty model', () => {
            var dataElementModel = d2.models.dataElement.create();

            respondTo('/dhis/api/schemas/dataElement', 'POST')
                .with(JSON.stringify({
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
                    }));

            return dataElementModel.validate()
                .then((validationStatus) => {
                    expect(validationStatus.status).to.be.false;
                });
        });

        describe('model with data', () => {
            var loadedDataElementModel;

            beforeEach(function () {
                respondTo('http://localhost:8080/dhis/api/dataElements/umC9U5YGDq4?fields=:all,attributeValues%5B:all,attribute%5Bid,name,displayName%5D%5D')
                    .with(JSON.stringify(window.fixtures.dataElements.umC9U5YGDq4));

                return d2.models.dataElement.get('umC9U5YGDq4')
                    .then(function (model) {
                        loadedDataElementModel = model;
                    });
            });

            it('should return true for an object from the api', function () {
                return loadedDataElementModel.validate()
                    .then((validationStatus) => {
                        expect(validationStatus.status).to.be.true;
                    });
            });
        });
    });

    // TODO: Stringify doesn't work because it has some sort of cyclic structure. Probably some polyfill that modifies base objects
    describe('list', () => {
        beforeEach(() => {
            respondTo('http://localhost:8080/dhis/api/dataElements?fields=:all')
                .with(JSON.stringify({dataElements: [window.fixtures.dataElements.umC9U5YGDq4]}));

            respondTo('http://localhost:8080/dhis/api/dataElements?filter=id:eq:umC9U5YGDq4&fields=:all')
                .with('{"dataElements": []}');
        });

        it('should load a list of dataElements from the server', () => {
            return d2.models.dataElement
                .list()
                .then(function (modelCollection) {
                    expect(modelCollection.size).to.equal(1);
                    expect(modelCollection.toArray()[0].id).to.equal('umC9U5YGDq4');
                });
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
        });
    });

    describe('save', () => {
        describe('existing model', () => {
            var loadedModel;

            beforeEach(function (done) {
                respondTo('http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=:all,userCredentials%5B:owner%5D')
                    .with(JSON.stringify(window.fixtures.users.VWgvyibrAq0));

                respondTo('/dhis/api/schemas/user', 'POST')
                    .with(JSON.stringify({
                            "httpStatus": "OK",
                            "httpStatusCode": 200,
                            "status": "OK",
                            "response": {
                                "responseType": "ValidationViolations"
                            }
                        }));

                respondTo('http://localhost:8080/dhis/api/users/VWgvyibrAq0?mergeStrategy=REPLACE', 'PUT')
                    .with(JSON.stringify({
                            response: {
                                importCount: {

                                }
                            }
                        }));

                d2.models.user.get('VWgvyibrAq0')
                    .then(function (model) {
                        loadedModel = model;
                    })
                    .then(done);
            });

            it('should save not save the model if there were no changes', function () {
                return loadedModel.save()
                    .catch(function (e) {
                        expect(e).to.equal('No changes to be saved');
                    });
            });

            it('should save the model when a property was changed', () => {
                loadedModel.firstName = 'Mark';

                return loadedModel.save()
            });
        });
    });

    describe('delete', () => {
        var loadedModel;

        beforeEach(function (done) {
            respondTo('http://localhost:8080/dhis/api/users/VWgvyibrAq0?fields=:all,userCredentials%5B:owner%5D')
                .with(JSON.stringify(window.fixtures.users.VWgvyibrAq0));

            respondTo('http://localhost:8080/dhis/api/users/VWgvyibrAq0', 'DELETE')
                .with(204);


            d2.models.user.get('VWgvyibrAq0')
                .then(function (model) {
                    loadedModel = model;
                    done();
                });
        });

        it('should call the api to delete the model', () => {
            return loadedModel.delete();
        });

        it('should fail when the resource does not exist', (done) => {
            respondTo('http://localhost:8080/dhis/api/users/VWgvyibrAq0', 'DELETE')
                .with(404, '{"message": "Resource does not exist"}');

            return loadedModel.delete()
                .then((d) => {
                    console.log('it was sucessful!', d);
                })
                .catch(() => {
                    done();
                });
        });
    });

    describe('getTranslatableProperties()', () => {
        it('should return no translatable properties if there are none', () => {
            expect(d2.models.dataElement.getTranslatableProperties()).to.deep.equal(['description', 'formName', 'name', 'shortName']);
        });

        it('should return no translatable properties if there are no properties on the schema', () => {
            expect(d2.models.user.getTranslatableProperties()).to.deep.equal([]);
        });
    });

    describe('getTranslatablePropertiesWithKeys()', () => {
        it('should return the translatable properties with their translation keys', () => {
            expect(d2.models.dataElement.getTranslatablePropertiesWithKeys()).to.deep.equal([
                { name: 'description', translationKey: 'DESCRIPTION' },
                { name: 'formName', translationKey: 'FORM_NAME' },
                { name: 'name', translationKey: 'NAME' },
                { name: 'shortName', translationKey: 'SHORT_NAME' },
            ]);
        });

        it('should return an empty array when there are no translation keys', () => {
            expect(d2.models.user.getTranslatablePropertiesWithKeys()).to.deep.equal([]);
        });
    });
});
