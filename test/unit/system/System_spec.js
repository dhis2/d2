const proxyquire = require('proxyquire').noCallThru();

const apiMock = {};

proxyquire('../../../src/system/System', {
    '../api/Api': {
        getApi: sinon.stub().returns(apiMock),
    },
});

describe('System', () => {
    const System = require('../../../src/system/System');
    const SystemConfiguration = require('../../../src/system/SystemConfiguration');
    const SystemSettings = require('../../../src/system/SystemSettings');
    let system;

    const mockSettingsMapping = {
        'keyLabelOnly': {label: 'label_1'},
        'keyDescOnly': {description: 'desc_1'},
        'keyDescLabel': {label: 'label_2', description: 'desc_2'},
        'keyDuplicate1': {label: 'label_1'},
        'keyDuplicate2': {label: 'label_2', description: 'desc_1'},
        'keyWithOptions': {
            label: 'label_3',
            options: {
                1: 'first_option_label',
                2: 'second_option_label',
                3: 3,
                4: 4,
                5: 'fifth_option_label',
            },
        },
    };

    beforeEach(() => {
        system = System.getSystem();
    });

    it('should be an instance of System', () => {
        expect(system).to.be.instanceOf(System);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => System()).to.throw('Cannot call a class as a function');
    });

    it('should contain an instance of SystemConfiguration', () => {
        expect(system.configuration).to.be.instanceOf(SystemConfiguration);
    });

    it('should contain an instance of SystemSettings', () => {
        expect(system.settings).to.be.instanceOf(SystemSettings);
    });

    describe('loadInstalledApps()', () => {
        let appsFromApi;

        beforeEach(() => {
            appsFromApi = [
                {
                    version: '0.4.8',
                    name: 'Data Approval',
                    description: 'Approvals app for PEPFAR',
                    icons: {
                        48: 'img/icons/dataapproval.png',
                    },
                    developer: {
                        url: 'http://www.dhis2.org',
                        name: 'Mark Polak',
                        company: 'DHIS2 Core Team',
                        email: 'markpo@ifi.uio.no',
                    },
                    activities: {
                        dhis: {
                            href: 'http://localhost:8080/dhis',
                        },
                    },
                    folderName: 'approvals',
                    launchUrl: 'http://localhost:8080/dhis/api/apps/approvals/index.html?v=0.4.8',
                    key: 'approvals',
                    launch_path: 'index.html?v=0.4.8',
                    default_locale: 'en',
                },
                {
                    version: '0.0.1',
                    name: 'Data Export Log',
                    description: 'Data export log viewer',
                    icons: {
                        48: 'icons/export.png',
                    },
                    developer: {
                        url: '',
                        name: 'Mark Polak',
                    },
                    activities: {
                        dhis: {
                            href: 'http://localhost:8080/dhis',
                        },
                    },
                    folderName: 'data-export-log',
                    launchUrl: 'http://localhost:8080/dhis/api/apps/data-export-log/index.html?1.0.0-rc1',
                    key: 'data-export-log',
                    launch_path: 'index.html?1.0.0-rc1',
                    default_locale: 'en',
                },
            ];

            apiMock.get = stub().returns(Promise.resolve(appsFromApi));
        });

        it('should set the list of installed apps onto the Settings object', () => {
            return system.loadInstalledApps()
                .then(() => {
                    expect(system.installedApps).to.deep.equal(appsFromApi);
                });
        });

        it('should reject the promise if the request fails', () => {
            apiMock.get = stub().returns(Promise.reject('Apps can not be loaded'));

            return system.loadInstalledApps()
                .catch((message) => {
                    expect(message).to.equal('Apps can not be loaded');
                });
        });

        it('should resolve with the returned list of apps', () => {
            return system.loadInstalledApps()
                .then(apps => {
                    expect(apps).to.deep.equal(appsFromApi);
                });
        });
    });

    describe('uploadApp()', () => {
        let appendSpy;
        let formData;

        beforeEach(() => {
            apiMock.post = stub().returns(Promise.resolve());

            // Fake FormData object
            appendSpy = spy();
            formData = {
                append: appendSpy,
            };
            // Fake formData global constructor
            global.FormData = function FormData() {
                return formData;
            };
        });

        afterEach(() => {
            global.FormData = undefined;
        });

        it('should be a function on the system object', () => {
            expect(system.uploadApp).to.be.a('function');
        });

        it('should call the post with the correct options', () => {
            const xhrOptions = {
                contentType: false,
                processData: false,
                xhr: undefined,
            };

            system.uploadApp('ZipFile');

            expect(apiMock.post).to.be.calledWith('apps', formData, xhrOptions);
        });

        it('should call append on the formData object to add the file to upload', () => {
            system.uploadApp('ZipFile');

            expect(formData.append).to.be.calledWith('file', 'ZipFile');
        });

        describe('xhr', () => {
            let progressCallbackSpy;
            let xhrMock;

            beforeEach(() => {
                progressCallbackSpy = spy();
                xhrMock = {
                    upload: {},
                };
                global.XMLHttpRequest = function XMLHttpRequest() {
                    return xhrMock;
                };
            });

            afterEach(() => {
                global.XMLHttpRequest = undefined;
            });

            it('should pass custom XMLHttpRequest Object with an on progress callback as an option', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);

                expect(apiMock.post.getCall(0).args[2].xhr).to.be.a('function');
                expect(apiMock.post.getCall(0).args[2].xhr.call()).to.equal(xhrMock);
            });

            it('should define the onprogress function onto the upload object of the xhr', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);

                expect(xhrMock.upload.onprogress).to.be.a('function');
            });

            it('should not call the callback if the progress can not be computed', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);
                xhrMock.upload.onprogress({});

                expect(progressCallbackSpy).not.to.be.called;
            });

            it('should call the callback spy if the progress can be computed', () => {
                system.uploadApp('ZipFile', progressCallbackSpy);
                xhrMock.upload.onprogress({
                    lengthComputable: true,
                    loaded: 10,
                    total: 50,
                });

                expect(progressCallbackSpy).to.be.calledWith(0.2);
            });
        });
    });

    describe('loadAppStore()', () => {
        it('should be a function on the system object', () => {
            expect(system.loadAppStore).to.be.a('function');
        });
    });
});
