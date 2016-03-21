import Api from '../../../src/api/Api';
import I18n from '../../../src/i18n/I18n';

describe('Internationalisation (I18n)', () => {
    let i18n;

    const mockTranslations = {
        'general_settings': 'General settings',
        'yes': 'Yup',
        'no': 'Nope',
        'system_settings_in_french': 'Paramètres du système',
        // 'escapes': 'Characters may be escaped! Even\nnewlines?!?',
    };

    const mockUnicode = 'Param\\u00e8tres du syst\\u00e8me';
    const mockEscape = 'Characters\\ may \\b\\e \\e\\s\\c\\a\\p\\e\\d\\!\\\\ Even\\\nnewline\\s\\?\\!\\?';
    const mockPropsFile = 'general_settings=General settings\n' +
        'yes=Yup\n' +
        'no=Nope\n\n# Blank lines and commends - ignored?\n#\n\n' +
        'system_settings_in_french=' + mockUnicode + '\n' +
        'escapes=' + mockEscape + '\n';

    beforeEach(() => {
        i18n = new I18n();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => I18n()).to.throw('Cannot call a class as a function'); // eslint-disable-line
    });

    it('should set an instance of Api onto the SystemConfiguration instance', () => {
        expect(i18n.api).to.be.instanceof(Api);
    });

    it('addSource() should be a function', () => {
        expect(i18n.addSource).to.be.instanceOf(Function);
    });

    it('addStrings() should be a function', () => {
        expect(i18n.addStrings).to.be.instanceOf(Function);
    });

    it('load() should be a function', () => {
        expect(i18n.load).to.be.instanceOf(Function);
    });

    it('should set the passed sources onto the object', () => {
        const sources = ['translation_18n'];

        i18n = new I18n(sources);

        expect(i18n.sources).to.equal(sources);
    });

    it('should use the passed Api object', () => {
        const mockApi = sinon.mock();

        i18n = new I18n([], mockApi);

        expect(i18n.api).to.equal(mockApi);
    });

    it('getTranslations() should throw an error is translations haven\'t been loaded yet', (done) => {
        try {
            i18n.getTranslation('some_string');
            done('No error thrown!');
        } catch (e) {
            done();
        }
    });

    describe('getI18n', () => {
        it('should be a function on the I18n class', () => {
            expect(I18n.getI18n).to.be.a('function');
        });

        it('should return a new instanceof I18n', () => {
            expect(I18n.getI18n()).to.be.instanceof(I18n);
        });
    });

    describe('addStrings()', () => {
        it('accepts a single string', () => {
            i18n.addStrings('yes');
            const strings = Array.from(i18n.strings);
            expect(strings).to.contain('yes');
            expect(strings.length).to.equal(1);
        });

        it('accepts an array of strings', () => {
            i18n.addStrings(['yes', 'no', 'maybe']);
            const strings = Array.from(i18n.strings);
            expect(strings).to.contain('yes');
            expect(strings).to.contain('no');
            expect(strings).to.contain('maybe');
            expect(strings.length).to.equal(3);
        });

        it('handles consequtive calls', () => {
            i18n.addStrings(['yes', 'no']);
            i18n.addStrings('maybe');
            i18n.addStrings('probably');
            const strings = Array.from(i18n.strings);
            expect(strings).to.contain('yes');
            expect(strings).to.contain('no');
            expect(strings).to.contain('maybe');
            expect(strings).to.contain('probably');
            expect(strings.length).to.equal(4);
        });

        it('doesn\'t add duplicates', () => {
            i18n.addStrings(['yes', 'no']);
            i18n.addStrings(['no', 'maybe']);
            i18n.addStrings(['maybe', 'probably', 'yes']);
            const strings = Array.from(i18n.strings);
            expect(strings).to.contain('yes');
            expect(strings).to.contain('no');
            expect(strings).to.contain('maybe');
            expect(strings).to.contain('probably');
            expect(strings.length).to.equal(4);
        });

        it('should not add empty strings', () => {
            spy(i18n.strings, 'add');

            i18n.addStrings(['yes', '', '  ']);

            expect(i18n.strings.add).to.be.calledOnce;
        });
    });

    describe('load()', () => {
        let apiGet;
        let apiPost;
        let apiReq;

        beforeEach(() => {
            apiGet = sinon.stub(i18n.api, 'get');
            apiGet.returns(Promise.resolve(mockTranslations));

            apiPost = sinon.stub(i18n.api, 'post');
            apiPost.returns(Promise.resolve(mockTranslations));

            apiReq = sinon.stub(i18n.api, 'request');
            apiReq.returns(Promise.resolve(mockPropsFile));

            i18n.addStrings(['yes', 'no']);
        });

        afterEach(() => {
            apiGet.restore();
            apiPost.restore();
            apiReq.restore();
        });

        it('should return a promise', (done) => {
            i18n.load().then(() => {
                done();
            }, err => {
                done(err);
            });
        });

        it('should POST to get untranslated strings', (done) => {
            i18n.load().then(() => {
                try {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(1);
                    expect(apiReq.callCount).to.equal(0);
                    expect(i18n.getTranslation('yes')).to.eql(mockTranslations.yes);
                    done();
                } catch (e) {
                    done(e);
                }
            }, err => {
                done(err);
            });
        });

        it('should load props files first', (done) => {
            i18n.addSource('props_file_name');
            i18n.load().then(() => {
                try {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(0);
                    expect(apiReq.callCount).to.equal(1);
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });

        it('keeps going if one props file fails', (done) => {
            i18n.addSource('props_file_one');
            i18n.addSource('props_file_two');
            i18n.addSource('props_file_three');
            apiReq.onCall(0).returns(Promise.resolve(mockPropsFile));
            apiReq.onCall(1).returns(Promise.reject('404 Fail or something'));
            apiReq.onCall(2).returns(Promise.resolve(''));
            i18n.load().then(() => {
                try {
                    expect(apiGet.callCount).to.equal(0);
                    expect(apiPost.callCount).to.equal(0);
                    expect(apiReq.callCount).to.equal(3);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
        });

        it('chooses strings based on source order', (done) => {
            i18n.addSource('slow_props_file');
            i18n.addSource('fast_props_file');
            apiReq.onCall(0).returns(new Promise((resolve) => {
                setTimeout(() => {
                    resolve('result=first priority file\n');
                });
            }));
            apiReq.onCall(1).returns(Promise.resolve('result=first file to load\n'));
            apiReq.throws(new Error('Requested too many files'));
            i18n.load().then(() => {
                try {
                    expect(i18n.getTranslation('result')).to.eql('first priority file');
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
        });

        it('should not add the strings if no responses were returned', () => {
            i18n.addStrings(['string_that_has_no_translation']);
            apiPost.onCall(0).returns(Promise.resolve({string_that_has_no_translation: 'string_that_has_no_translation'}));

            return i18n.load()
                .then(() => expect(i18n.translations.string_that_has_no_translation).to.be.undefined);
        });
    });

    describe('async API', () => {
        let apiGet;
        let apiPost;
        let apiReq;

        beforeEach(() => {
            apiGet = sinon.stub(i18n.api, 'get');
            apiGet.returns(Promise.resolve(mockTranslations));

            apiPost = sinon.stub(i18n.api, 'post');
            apiPost.returns(Promise.resolve(mockTranslations));

            apiReq = sinon.stub(i18n.api, 'request');
            apiReq.returns(Promise.resolve(mockPropsFile));

            i18n.addSource('mockPropsFile');
            i18n.addStrings(Object.keys(mockTranslations));
        });

        afterEach(() => {
            apiGet.restore();
            apiPost.restore();
            apiReq.restore();
        });

        describe('getTranslation()', () => {
            it('returns the correct translations', (done) => {
                i18n.load().then(() => {
                    try {
                        Object.keys(mockTranslations).forEach(key => {
                            expect(i18n.getTranslation(key)).to.eql(mockTranslations[key]);
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('decodes unicode entities from properties files', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(apiGet.callCount).to.equal(0);
                        expect(apiPost.callCount).to.equal(0);
                        expect(apiReq.callCount).to.equal(1);
                        expect(i18n.getTranslation('system_settings_in_french')).to.eql(mockTranslations.system_settings_in_french);
                        expect(i18n.getTranslation('system_settings_in_french')).to.not.eql(mockUnicode);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            xit('handles escaped characters properly', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(apiGet.callCount).to.equal(0);
                        expect(apiPost.callCount).to.equal(0);
                        expect(apiReq.callCount).to.equal(1);
                        expect(i18n.getTranslation('escapes')).to.eql(mockTranslations.escapes);
                        expect(i18n.getTranslation('escapes')).to.not.eql(mockEscape);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('returns ** string ** for unknown strings', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.getTranslation('string')).to.eql('** string **');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });
        });

        describe('isTranslated()', () => {
            it('returns true for translated strings', (done) => {
                i18n.load().then(() => {
                    try {
                        Object.keys(mockTranslations).forEach(key => {
                            expect(i18n.isTranslated(key)).to.eql(true);
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('returns false for untranslated strings', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.isTranslated('string')).to.eql(false);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('totally tilts out if translations haven\'t been loaded yet', (done) => {
                try {
                    expect(i18n.isTranslated('some random string')).to.throw(Error);
                    done(new Error('No error thrown'));
                } catch (e) {
                    done();
                }
            });
        });

        describe('getUntranslatedStrings()', () => {
            it('returns undefined if translations haven\'t been loaded yet', () => {
                expect(i18n.getUntranslatedStrings()).to.eql(undefined);
            });

            it('returns an array', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.getUntranslatedStrings()).to.be.instanceOf(Array);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('doesn\'t return translated strings', (done) => {
                i18n.addStrings('string');
                i18n.load().then(() => {
                    try {
                        const str = i18n.getUntranslatedStrings();
                        expect(str).to.contain('string');
                        expect(str).to.not.contain('yes');
                        expect(str).to.not.contain('some_random_string');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });
        });
    });
});
