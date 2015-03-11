import {isValidUid} from 'd2/lib/check';
import {throwError} from 'd2/lib/utils';
import Model from 'd2/model/Model';

class ModelCollection extends Map {
    static create() {
        return new ModelCollection();
    }

    add(value) {
        if (!(value instanceof Model)) {
            throwError('Values of a ModelCollection must be instances of Model');
        }
        if (!isValidUid(value.id)) {
            throwError('Can not add a Model without id to a ModelCollection');
        }

        super.set(value.id, value);
        return this;
    }
}

export default ModelCollection;
