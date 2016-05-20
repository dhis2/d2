import organisationUnitGroupSetDefaults from './model-defaults/organisationUnitGroupSet';
import categoryDefaults from './model-defaults/category';
import categoryOptionGroupSetDefaults from './model-defaults/categoryOptionGroupSet';
import dataElementDefaults from './model-defaults/dataElement';
import dataElementGroupSetDefaults from './model-defaults/dataElementGroupSet';
import dataSetDefaults from './model-defaults/dataSet';

export const defaultValues = new Map([
    ['organisationUnitGroupSet', organisationUnitGroupSetDefaults],
    ['category', categoryDefaults],
    ['categoryOptionGroupSet', categoryOptionGroupSetDefaults],
    ['dataElement', dataElementDefaults],
    ['dataElementGroupSet', dataElementGroupSetDefaults],
    ['dataSet', dataSetDefaults],
]);

export function getDefaultValuesForModelType(modelDefinitionName) {
    if (defaultValues.has(modelDefinitionName)) {
        return defaultValues.get(modelDefinitionName);
    }
    return {};
}
