
describe('System', () => {
    const System = require('../../../src/system/System');
    const SystemConfiguration = require('../../../src/system/SystemConfiguration');
    const SystemSettings = require('../../../src/system/SystemSettings');
    let sys;

    const mockSettingsMapping = {
        'keyLabelOnly': { label: 'label_1' },
        'keyDescOnly': { description: 'desc_1' },
        'keyDescLabel': { label: 'label_2', description: 'desc_2' },
        'keyDuplicate1': { label: 'label_1' },
        'keyDuplicate2': { label: 'label_2', description: 'desc_1' },
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
});
