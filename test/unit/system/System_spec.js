import fixtures from '../../fixtures/fixtures';
import Api from '../../../src/api/Api';

const proxyquire = require('proxyquire').noCallThru();

const apiMock = {
    jquery: {
        ajax: sinon.stub(),
    },
};

describe('System', () => {
    const System = require('../../../src/system/System');
    const SystemConfiguration = require('../../../src/system/SystemConfiguration');
    const SystemSettings = require('../../../src/system/SystemSettings');
    let system;

    beforeEach(() => {
        sinon.stub(Api, 'getApi').returns(apiMock);

        system = new System(new SystemSettings(), new SystemConfiguration());
    });

    afterEach(() => {
        Api.getApi.restore();
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
                .catch(error => error)
                .then((message) => {
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
        beforeEach(() => {
            system.setSystemInfo({
                version: '2.22',
            });

            apiMock.get = stub()
                .returns(Promise.resolve(fixtures.get('/appStore')));
        });

        it('should be a function on the system object', () => {
            expect(system.loadAppStore).to.be.a('function');
        });

        it('should return a promise', () => {
            expect(system.loadAppStore()).to.be.instanceof(Promise);
        });

        it('should request the api for the appStore', () => {
            system.loadAppStore();

            expect(apiMock.get).to.be.calledWith('appStore');
        });

        it('should return the compatible apps from the api', () => {
            const expectedApps = fixtures.get('/appStore');

            // Only the second app is compatible
            expectedApps.apps[0].versions = [expectedApps.apps[0].versions[1]];

            return system.loadAppStore()
                .then((apps) => {
                    expect(apps).to.deep.equal(expectedApps);
                });
        });

        it('should return the compatible apps', () => {
            const returnedApps = fixtures.get('/appStore');

            returnedApps.apps = [
                {
                    versions: [
                        {min_platform_version: '2.13', max_platform_version: '2.20'},
                        {min_platform_version: '2.20'},
                    ],
                },
                {
                    versions: [
                        {min_platform_version: '2.25', max_platform_version: '2.26'},
                        {min_platform_version: '2.26'},
                    ],
                },
                {
                    versions: [
                        {min_platform_version: '2.21'},
                    ],
                },
                {
                    versions: [
                        {max_platform_version: '2.19'},
                    ],
                },
            ];

            apiMock.get.returns(Promise.resolve(returnedApps));

            return system.loadAppStore()
                .then((apps) => {
                    expect(apps.apps.length).to.equal(2);
                });
        });

        it('should return all the apps when compatibility flag is set to false', () => {
            return system.loadAppStore(false)
                .then((apps) => {
                    expect(apps.apps.length).to.equal(fixtures.get('/appStore').apps.length);
                });
        });

        it('should reject the promise when the request fails', () => {
            apiMock.get.returns(Promise.reject('Request for appStore failed'));

            return system.loadAppStore()
                .catch(error => error)
                .then(error => {
                    expect(error).to.equal('Request for appStore failed');
                });
        });

        it('should reject the promise when system.version is not set', () => {
            system.version = undefined;

            return system.loadAppStore()
                .catch(error => error)
                .then(error => {
                    expect(error.message).to.equal('Cannot read property \'major\' of undefined');
                });
        });
    });

    describe('installAppVersion()', () => {
        beforeEach(() => {
            apiMock.post.returns(Promise.resolve(''));
        });

        it('should be a function on the system object', () => {
            expect(system.installAppVersion).to.be.a('function');
        });

        it('should reject the promise when the request fails', () => {
            apiMock.post.returns(Promise.reject('Request for installation failed'));

            return system.installAppVersion('PyYnjVl5iGt')
                .catch(error => error)
                .then(errorMessage => {
                    expect(errorMessage).to.equal('Request for installation failed');
                });
        });

        it('should call the api with the correct url', () => {
            return system.installAppVersion('PyYnjVl5iGt')
                .then(() => {
                    expect(apiMock.post).to.be.calledWith('appStore/PyYnjVl5iGt');
                });
        });

        it('should resolve the promise without a value', () => {
            return system.installAppVersion('PyYnjVl5iGt')
                .then((response) => {
                    expect(response).to.be.undefined;
                });
        });
    });

    describe('uninstallApp()', () => {
        beforeEach(() => {
            apiMock.delete = stub().returns(Promise.resolve({}));
        });

        it('should be a function on the system object', () => {
            expect(system.uninstallApp).to.be.a('function');
        });

        it('should call the api.delete method with the correct url', () => {
            return system.uninstallApp('PyYnjVl5iGt')
                .then(() => {
                    expect(apiMock.delete).to.be.calledWith('apps/PyYnjVl5iGt');
                });
        });

        it('should resolve the request even when the api request fails', () => {
            apiMock.delete = stub().returns(Promise.reject({}));

            return system.uninstallApp('PyYnjVl5iGt');
        });
    });

    describe('reloadApps()', () => {
        beforeEach(() => {
            apiMock.update = stub().returns(Promise.resolve());
        });

        it('should be a function on the system object', () => {
            expect(system.reloadApps).to.be.a('function');
        });

        it('should call the update method on the api', () => {
            return system.reloadApps()
                .then(() => {
                   expect(apiMock.update).to.be.calledWith('apps');
                });
        });

        it('should call system.loadInstalledApps on success ', () => {
            spy(system, 'loadInstalledApps');

            return system.reloadApps()
                .then(() => {
                    expect(system.loadInstalledApps).to.be.called;
                });
        });

        it('should chain the promise from loadInstalledApps', () => {
            const loadInstalledAppsPromise = Promise.resolve('Apps loaded');

            stub(system, 'loadInstalledApps').returns(loadInstalledAppsPromise);

            return system.reloadApps()
                .then((message) => expect(message).to.equal('Apps loaded'));
        });

        it('should not call loadInstalledApps when the update request fails', () => {
            apiMock.update.returns(Promise.reject());
            spy(system, 'loadInstalledApps');

            return system.reloadApps()
                .catch(message => message)
                .then(() => {
                    expect(system.loadInstalledApps).not.to.be.called;
                });
        });
    });

    describe('compareVersions()', () => {
        let systemVersion;
        let appVersion;

        beforeEach(() => {
            systemVersion = {
                major: 2,
                minor: 23,
                snapshot: true,
            };
            appVersion = {
                major: 2,
                minor: 23,
                snapshot: true,
            };
        });

        it('should be a function on the system class', () => {
            expect(System.compareVersions).to.be.a('function');
        });

        it('should return 0 for equal versions', () => {
            expect(System.compareVersions(systemVersion, appVersion)).to.equal(0);
        });

        it('should return 1 for a larger major system version', () => {
            systemVersion.major = 3;

            expect(System.compareVersions(systemVersion, appVersion)).to.equal(1);
        });

        it('should return 1 for a larger minor version', () => {
            systemVersion.minor = 24;

            expect(System.compareVersions(systemVersion, appVersion)).to.equal(1);
        });

        it('should return 1 when the app is a snapshot version', () => {
            systemVersion.snapshot = false;
            appVersion.snapshot = true;

            expect(System.compareVersions(systemVersion, appVersion)).to.equal(1);
        });

        it('should return -1 when the app is not a snapshot', () => {
            systemVersion.snapshot = true;
            appVersion.snapshot = false;

            expect(System.compareVersions(systemVersion, appVersion)).to.equal(-1);
        });

        it('should do correct comparison when a string is passed as a version', () => {
            expect(System.compareVersions('2.15', '2.16')).to.equal(-1);
            expect(System.compareVersions('2.20-SNAPSHOT', '2.16')).to.equal(4);
        });
    });

    describe('isVersionCompatible()', () => {
        let appVersion;
        let systemVersion;

        beforeEach(() => {
            stub(System, 'compareVersions');

            appVersion = {
                min_platform_version: '2.22',
                max_platform_version: '2.23-SNAPSHOT',
            };
            systemVersion = '2.23';
        });

        afterEach(() => {
            System.compareVersions.restore();
        });

        it('should return false when the app is not new enough', () => {
            expect(System.isVersionCompatible(systemVersion, appVersion)).to.be.false;
        });

        it('should return false when the app is too old', () => {
            expect(System.isVersionCompatible(systemVersion, appVersion)).to.be.false;
        });

        it('should return true when the system version is within the app version range', () => {
            appVersion.min_platform_version = '2.20';
            appVersion.max_platform_version = '2.25';

            expect(System.isVersionCompatible(systemVersion, appVersion));
        });

        it('should return true when no version bounds are given', () => {
            appVersion = {};

            expect(System.isVersionCompatible(systemVersion, appVersion)).to.be.true;
        });

        it('should return false when the version is not compatible', () => {
            expect(System.isVersionCompatible('2.22', {
                min_platform_version: '2.17',
                max_platform_version: '2.20',
            })).to.be.false;
        });
    });

    describe('getSystem', () => {
        it('should return the same instance on consecutive requests', () => {
            expect(System.getSystem()).to.equal(System.getSystem());
        });
    });
});
