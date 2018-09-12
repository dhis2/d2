import AnalyticsResponseHeader from './AnalyticsResponseHeader';
import AnalyticsResponseRow from './AnalyticsResponseRow';

const booleanMap = {
    0: 'No', // XXX i18n.no || 'No',
    1: 'Yes', // i18n.yes || 'Yes',
};

const OUNAME = 'ouname';
const OU = 'ou';

const DEFAULT_COLLECT_IGNORE_HEADERS = [
    'psi',
    'ps',
    'eventdate',
    'longitude',
    'latitude',
    'ouname',
    'oucode',
    'eventdate',
    'eventdate',
];

const DEFAULT_PREFIX_IGNORE_HEADERS = ['dy', ...DEFAULT_COLLECT_IGNORE_HEADERS];

const getParseMiddleware = (type) => {
    switch (type) {
    case 'STRING':
    case 'TEXT':
        return value => `${value}`;
    case 'INTEGER':
    case 'NUMBER':
        return value => (!Number.isNaN(+value) && Number.isFinite(+value) ? parseFloat(+value) : value);
    default:
        return value => value;
    }
};

const isPrefixHeader = (header, dimensions) => {
    if (DEFAULT_PREFIX_IGNORE_HEADERS.includes(header.name)) {
        return false;
    }

    return Boolean(Array.isArray(dimensions) && dimensions.length === 0);
};

const isCollectHeader = (header, dimensions) => {
    if (DEFAULT_COLLECT_IGNORE_HEADERS.includes(header.name)) {
        return false;
    }

    return Boolean(Array.isArray(dimensions) && dimensions.length === 0);
};

const getPrefixedId = (id, prefix) => `${prefix || ''} ${id}`;

const getNameByIdsByValueType = (id, valueType) => {
    if (valueType === 'BOOLEAN') {
        return booleanMap[id];
    }

    return id;
};

class AnalyticsResponse {
    constructor(response) {
        if (response) {
            this.response = response;
            this.headers = this.extractHeaders();
            this.rows = this.extractRows();
            this.metaData = this.extractMetadata();
        }
    }

    extractHeaders() {
        const dimensions = this.response.metaData.dimensions;
        const headers = this.response.headers || [];

        return headers.map(
            (header, index) =>
                new AnalyticsResponseHeader(header, {
                    isPrefix: isPrefixHeader(header, dimensions[header.name]),
                    isCollect: isCollectHeader(header, dimensions[header.name]),
                    index,
                }),
        );
    }

    extractRows() {
        const headersWithOptionSet = this.headers.filter(header => header.optionSet);
        let rows = this.response.rows;

        if (headersWithOptionSet.length) {
            rows = rows.slice();

            const optionCodeIdMap = this.optionCodeIdMap();

            // replace option code with option uid
            headersWithOptionSet.forEach((header) => {
                rows.forEach((row, index) => {
                    const id = optionCodeIdMap[header.name][row[header.index]];

                    if (id) {
                        rows[index][header.index] = id;
                    }
                });
            });
        }

        // map to AnalyticsResponseRow
        return rows.map(row => new AnalyticsResponseRow(row));
    }

    extractMetadata() {
        const metaData = { ...this.response.metaData };

        const { dimensions, items } = metaData;

        // populate metaData dimensions and items
        this.headers
            .filter(header => !DEFAULT_COLLECT_IGNORE_HEADERS.includes(header.name))
            .forEach((header) => {
                let ids;

                // collect row values
                if (header.isCollect) {
                    ids = this.getSortedUniqueRowIdStringsByHeader(header);
                    dimensions[header.name] = ids;
                } else {
                    ids = dimensions[header.name];
                }

                if (header.isPrefix) {
                    // create prefixed dimensions array
                    dimensions[header.name] = ids.map(id => getPrefixedId(id, header.name));

                    // create items
                    dimensions[header.name].forEach((prefixedId, index) => {
                        const id = ids[index];
                        const valueType = header.valueType;

                        const name = getNameByIdsByValueType(id, valueType);

                        items[prefixedId] = { name };
                    });
                }
            });

        // for events, add items from 'ouname'
        if (this.hasHeader(OUNAME) && this.hasHeader(OU)) {
            const ouNameHeaderIndex = this.getHeader(OUNAME).getIndex();
            const ouHeaderIndex = this.getHeader(OU).getIndex();
            let ouId;
            let ouName;

            this.rows.forEach((row) => {
                ouId = row.getAt(ouHeaderIndex);

                if (items[ouId] === undefined) {
                    ouName = row.getAt(ouNameHeaderIndex);

                    items[ouId] = {
                        name: ouName,
                    };
                }
            });
        }

        return metaData;
    }

    getHeader(name) {
        return this.headers.find(header => header.name === name);
    }

    hasHeader(name) {
        return this.getHeader(name) !== undefined;
    }

    getSortedUniqueRowIdStringsByHeader(header) {
        const parseByType = getParseMiddleware(header.valueType);
        const parseString = getParseMiddleware('STRING');

        const rowIds = Array.from(
            // unique values
            new Set(this.rows.map(responseRow => parseByType(responseRow.getAt(header.index)))),
            // remove empty values
        ).filter(id => id !== '');

        return rowIds.sort().map(id => parseString(id));
    }

    optionCodeIdMap() {
        const { dimensions, items } = this.response.metaData;
        const map = {};

        this.headers.filter(header => typeof header.optionSet === 'string').forEach((header) => {
            const optionIds = dimensions[header.name];

            map[header.name] = optionIds
                .map(id => ({
                    [items[id].code]: id,
                }))
                .reduce((acc, obj) => Object.assign(acc, obj), {});
        });

        return map;
    }

    sortOrganisationUnitsHierarchy() {
        const organisationUnits = this.metaData.dimensions.ou;

        organisationUnits.forEach((organisationUnit, i) => {
            const hierarchyPrefix = this.metaData.ouHierarchy[organisationUnit];
            const hierarchyIds = [organisationUnit];
            const hierarchyNames = [];

            hierarchyPrefix
                .split('/')
                .reverse()
                .forEach((ouId) => {
                    hierarchyIds.unshift(ouId);
                });

            hierarchyIds.forEach((ouId) => {
                if (this.metaData.items[ouId]) {
                    hierarchyNames.push(this.metaData.items[ouId].name);
                }
            });

            organisationUnits[i] = {
                id: organisationUnit,
                fullName: hierarchyNames.join(' / '),
            };
        });

        // XXX how does this work with different languages/collations?
        organisationUnits.sort((a, b) => {
            const aFullName = a.fullName;
            const bFullName = b.fullName;

            if (aFullName < bFullName) {
                return -1;
            }

            return aFullName > bFullName ? 1 : 0;
        });

        this.metaData.dimensions.ou = organisationUnits.map(ou => ou.id);
    }
}

export default AnalyticsResponse;
