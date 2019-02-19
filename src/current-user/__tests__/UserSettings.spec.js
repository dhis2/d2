import MockApi from '../../../src/api/Api';
import UserSettings from '../../../src/current-user/UserSettings';

jest.mock('../../../src/api/Api');

describe('CurrentUser.userSettings', () => {
    const userSettingsFixture = { keyUiLocale: 'en' };
    let userSettings;

    beforeEach(() => {
        userSettings = new UserSettings();
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => UserSettings()).toThrowErrorMatchingSnapshot(); // eslint-disable-line
    });

    it('should set an instance of MockApi onto the UserSettings instance', () => {
        expect(userSettings.api).toBe(MockApi.getApi());
    });

    describe('all', () => {
        beforeEach(() => {
            userSettings.api.get
                .mockReturnValue(Promise.resolve(userSettingsFixture));
        });

        it('should be a function', () => {
            expect(userSettings.all).toBeInstanceOf(Function);
        });

        it('should call the api to get all the userSettings', () => {
            expect.assertions(2);

            return userSettings.all().then(() => {
                expect(userSettings.api.get).toHaveBeenCalledTimes(1);
                expect(userSettings.api.get.mock.calls[0][0]).toBe('userSettings');
            });
        });

        it('should resolve the promise with the settings', () => {
            expect.assertions(1);

            return userSettings.all()
                .then((settings) => {
                    expect(settings.keyUiLocale).toBe('en');
                });
        });

        it('should cache the current user settings', () => {
            expect.assertions(2);

            return userSettings.all().then(() => userSettings.all())
                .then(() => {
                    expect(userSettings.api.get).toHaveBeenCalledTimes(1);
                    expect(userSettings.settings).toEqual(userSettingsFixture);
                });
        });
    });

    describe('get', () => {
        beforeEach(() => {
            userSettings.api.get
                .mockReturnValue(Promise.resolve(userSettingsFixture.keyUiLocale));
        });

        it('should be a function', () => {
            expect(userSettings.get).toBeInstanceOf(Function);
        });

        it('should return a Promise', () => {
            const result = userSettings.get('keyUiLocale');

            expect(result).toBeInstanceOf(Promise);
        });

        it('should reject the promise with an error if no key has been specified', () => {
            expect.assertions(2);

            return userSettings.get()
                .catch((error) => {
                    expect(error).toBeInstanceOf(TypeError);
                    expect(error.message)
                        .toBe('A "key" parameter should be specified when calling get() on userSettings');
                });
        });

        it('should call the api to get the value', () => {
            userSettings.get('keyUiLocale');

            expect(userSettings.api.get).toBeCalledWith('userSettings/keyUiLocale');
        });

        it('should return the value from the promise', () => {
            expect.assertions(1);

            return userSettings.get('keyUiLocale')
                .then((value) => {
                    expect(value).toBe('en');
                });
        });

        it('should try to transform the response to json if possible', () => {
            userSettings.api.get
                .mockReturnValueOnce(Promise.resolve('{"mydataKey": "myDataValue"}'));

            expect.assertions(1);

            return userSettings.get('keyUiLocale')
                .then((value) => {
                    expect(value).toEqual({ mydataKey: 'myDataValue' });
                });
        });

        it('should reject the promise if the value is empty', () => {
            userSettings.api.get
                .mockReturnValueOnce(Promise.resolve(''));

            expect.assertions(1);

            return userSettings.get('keyThatDefinitelyDoesNotExist')
                .catch((error) => {
                    expect(error.message).toBe('The requested userSetting has no value or does not exist.');
                });
        });

        it('should use the cache', () => {
            userSettings.api.get
                .mockReturnValueOnce(Promise.resolve(userSettingsFixture));

            expect.assertions(2);

            return userSettings.all()
                .then(() => userSettings.get('keyUiLocale'))
                .then((value) => {
                    expect(userSettings.api.get).toHaveBeenCalledTimes(1);
                    expect(value).toBe(userSettingsFixture.keyUiLocale);
                });
        });

        it('should also return a promise when serving cached values', () => {
            userSettings.api.get.mockReturnValueOnce(Promise.resolve(userSettingsFixture));

            expect.assertions(1);

            return userSettings.all()
                .then(() => {
                    expect(userSettings.get('keyUiLocale')).toBeInstanceOf(Promise);
                });
        });
    });

    describe('set', () => {
        beforeEach(() => {
            userSettings.api.get
                .mockReturnValue(Promise.resolve(userSettingsFixture));
            userSettings.api.post
                .mockReturnValueOnce(Promise.resolve());
            userSettings.api.delete
                .mockReturnValueOnce(Promise.resolve());
        });

        afterEach(() => {
            userSettings = new UserSettings();
        });

        it('should POST to the API', () => userSettings.set('mySetting', 'my value')
            .then(() => {
                expect(userSettings.api.get).toHaveBeenCalledTimes(0);
                expect(userSettings.api.post).toHaveBeenCalledTimes(1);
                expect(userSettings.api.delete).toHaveBeenCalledTimes(0);
            }));

        it('should DELETE if the value is null or an empty string', () => userSettings.set('mySetting', '')
            .then(() => {
                expect(userSettings.api.get).toHaveBeenCalledTimes(0);
                expect(userSettings.api.post).toHaveBeenCalledTimes(0);
                expect(userSettings.api.delete).toHaveBeenCalledTimes(1);
            }));

        it('should clear out the cache', () => userSettings.all()
            .then(() => userSettings.all())
            .then(() => userSettings.set('a', 'b'))
            .then(() => userSettings.all())
            .then(() => userSettings.all())
            .then(() => {
                expect(userSettings.api.post).toHaveBeenCalledTimes(1);
                expect(userSettings.api.get).toHaveBeenCalledTimes(2);
            }));
    });
});
