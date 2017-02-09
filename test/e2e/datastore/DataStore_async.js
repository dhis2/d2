
import { init } from '../../../src/d2';
describe('dataStore', () => {
    let baseURL;
    let headers;
    let initConfig;
    let api;
    beforeEach(() => {
        initConfig = {
            baseUrl: 'https://play.dhis2.org/test/api',
            headers: { Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=' },
        };
        api = init(initConfig);
    });

    it('should return an array when you get a namespace', (done) => {
        api.then((d2) => {
            d2.dataStore.get('asf').then((namespace) => {
                expect(namespace.keys).to.be.an('array');
                done();
            }).catch(e => done(e));
        })
            .catch((e) => {
                done(e);
            });
    });

    it('should return an array when you get namespaces', (done) => {
        api
            .then((d2) => {
                d2.dataStore.getAll().then((namespaces) => {
                    expect(namespaces).to.be.an('array');
                    done();
                });
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should return an empty namespace if it does not exists', (done) => {
        api
            .then((d2) => {
                d2.dataStore.get('oasfioq').then((namespace) => {
                    expect(namespace.keys).to.be.empty;
                    done();
                }).catch(e => done(e));
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should return a value if it exists', (done) => {
        api
            .then((d2) => {
                d2.dataStore.get('asfaaaa').then((namespace) => {
                    namespace.get('a').then((res) => {
                        console.log(res);
                        expect(res).to.be.equal('2');
                        done();
                    }).catch(e => done(e));
                    //  done();
                }).catch(e => done(e));
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should get an empty namespace if autoload is false', (done) => {
        api
            .then((d2) => {
                d2.dataStore.get('asfaaaa', false).then((namespace) => {
                    expect(namespace.getKeys()).to.be.empty;
                    done();
                }).catch(e => done(e));
            })
            .catch((e) => {
                done(e);
            });
    });
});
