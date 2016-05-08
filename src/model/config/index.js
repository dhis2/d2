import organisationUnitGroupSetDefaults from './model-defaults/organisationUnitGroupSet';
import categoryDefaults from './model-defaults/category';
import categoryOptionGroupSetDefaults from './model-defaults/categoryOptionGroupSet';
import dataElementGroupSetDefaults from './model-defaults/dataElementGroupSet';
import dataSetDefaults from './model-defaults/dataSet';

export const defaultValues = new Map([
    ['organisationUnitGroupSet', organisationUnitGroupSetDefaults],
    ['category', categoryDefaults],
    ['categoryOptionGroupSet', categoryOptionGroupSetDefaults],
    ['dataElementGroupSet', dataElementGroupSetDefaults],
    ['dataSet', dataSetDefaults],
]);

export function getDefaultValuesForModelType(modelDefinitionName) {
    if (defaultValues.has(modelDefinitionName)) {
        return defaultValues.get(modelDefinitionName);
    }
    return {};
}
