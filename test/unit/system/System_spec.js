
describe('System', () => {
    const System = require('../../../src/system/System');
    const SystemConfiguration = require('../../../src/system/SystemConfiguration');
    const SystemSettings = require('../../../src/system/SystemSettings');
    let sys;

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
        sys = System.getSystem();
    });

    it('should be an instance of System', () => {
        expect(sys).to.be.instanceOf(System);
    });

    it('should not be allowed to be called without new', () => {
        expect(() => System()).to.throw('Cannot call a class as a function');
    });

    it('should contain an instance of SystemConfiguration', () => {
        expect(sys.configuration).to.be.instanceOf(SystemConfiguration);
    });

    it('should contain an instance of SystemSettings', () => {
        expect(sys.settings).to.be.instanceOf(SystemSettings);
    });

    it('should expose a function called getI18nStrings', () => {
        expect(sys.getI18nStrings).to.be.instanceOf(Function);
    });

    describe('getI18nStrings()', () => {
        beforeEach(() => {
            sys.settings.mapping = mockSettingsMapping;
        });

        it('should return a Set', () => {
            expect(sys.getI18nStrings()).to.be.instanceOf(Set);
        });

        it('should only export duplicate strings once', () => {
            expect(Array.from(sys.getI18nStrings()).length).to.equal(8);
        });

        it('should export all the labels and descriptions', () => {
            const strings = Array.from(sys.getI18nStrings());
            expect(strings).to.contain('label_1');
            expect(strings).to.contain('label_2');
            expect(strings).to.contain('desc_1');
            expect(strings).to.contain('desc_2');
        });

        it('should include option labels', () => {
            const strings = Array.from(sys.getI18nStrings());
            expect(strings).to.contain('label_3');
            expect(strings).to.contain('first_option_label');
            expect(strings).to.contain('second_option_label');
            expect(strings).to.contain('fifth_option_label');
        });

        it('should not treat numeric options as labels', () => {
            const strings = Array.from(sys.getI18nStrings());
            expect(strings).to.not.contain('3');
            expect(strings).to.not.contain(3);
            expect(strings).to.not.contain('4');
            expect(strings).to.not.contain(4);
        });
    });
});
