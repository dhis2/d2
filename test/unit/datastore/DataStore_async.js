import { dataStore } from '../../../src/datastore/DataStore';
import { init } from '../../../src/d2';

describe('dataStore', () => {
    let baseURL;
    let headers;
    let initConfig;
    let api;
    beforeEach(() => {
        console.log("asf")
        initConfig = {
            baseUrl: 'https://play.dhis2.org/test/api',
            headers: { Authorization: 'Basic YWRtaW46ZGlzdHJpY3Q=' }
        }
        api = init(initConfig);
    });

    it('should return an array when you open a namespace', done => {
        api
            .then(d2 => {
                console.log(dataStore)
                dataStore.open('asf').then(namespace => {
                    expect(namespace.keys).to.be.an('array');
                    done();
                }).catch(e => done(e))
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should return an array when you get namespaces', done => {
        api
            .then(d2 => {
                console.log(dataStore)
                dataStore.getNamespaces().then(namespaces => {
                    expect(namespaces).to.be.an('array');
                    done();
                });
                console.log("test")
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should return an empty namespace if it does not exists', done => {
       api
            .then(d2 => {
                console.log(dataStore)
                dataStore.open('oasfioq').then(namespace => {
                    expect(namespace.keys).to.be.empty;
                    done()
                    }).catch(e => done(e))
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should return a value if it exists', done => {
        api
            .then(d2 => {
                console.log(dataStore)
                dataStore.open('asfaaaa').then(namespace => {
                    namespace.get('a').then(res => {
                        console.log(res)
                        expect(res).to.be.equal("2")
                        done();
                    }).catch(e => done(e))
                    //  done();
                }).catch(e => done(e))
            })
            .catch((e) => {
                done(e);
            });
    });

    it('should open an empty namespace if autoload is false', done => {
        api
            .then(d2 => {
                console.log(dataStore)
                dataStore.open('asfaaaa', false).then(namespace => {
                    expect(namespace.getKeys()).to.be.empty;
                    done();
                }).catch(e => done(e))
            })
            .catch((e) => {
                done(e);
            });
    });
});