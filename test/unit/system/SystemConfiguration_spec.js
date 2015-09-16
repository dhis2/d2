
describe('System.configuration', () => {
    const Api = require('d2/api/Api');
    const SystemConfiguration = require('d2/system/SystemConfiguration');
    let configuration;
    let stub;

    const mockConfiguration = {
        systemId: 'eed3d451-4ff5-4193-b951-ffcc68954299',
        feedbackRecipients: {
            'name': 'Feedback Message Recipients',
            'created': '2011-12-25T15:52:04.409+0000',
            'lastUpdated': '2015-09-09T10:10:39.191+0000',
            'externalAccess': false,
            'displayName': 'Feedback Message Recipients',
            'id': 'QYrzIjSfI8z',
            'users': [
                {
                    'name': 'User Mobile',
                    'created': '2012-11-13T15:08:22.136+0000',
                    'lastUpdated': '2013-05-29T14:54:33.308+0000',
                    'externalAccess': false,
                    'displayName': 'User Mobile',
                    'id': 'PhzytPW3g2J',
                }, {
                    'name': 'John Traore',
                    'created': '2013-04-18T15:15:08.407+0000',
                    'lastUpdated': '2015-09-09T10:10:39.164+0000',
                    'externalAccess': false,
                    'displayName': 'John Traore',
                    'id': 'xE7jOejl9FI',
                }, {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
            ],
        },
        offlineOrganisationUnitLevel: {
            'name': 'Chiefdom',
            'created': '2011-12-24T11:24:22.935+0000',
            'lastUpdated': '2015-03-13T18:30:01.825+0000',
            'externalAccess': false,
            'level': 3,
            'displayName': 'Chiefdom',
            'id': 'tTUf91fCytl',
        },
        infrastructuralIndicators: {
            'name': 'Staffing',
            'created': '2013-04-18T12:36:27.000+0000',
            'lastUpdated': '2013-04-18T12:36:27.000+0000',
            'externalAccess': false,
            'publicAccess': 'rw------',
            'displayName': 'Staffing',
            'id': 'EdDc97EJUdd',
            'indicators': [
                {
                    'code': 'IN_52460',
                    'name': 'Population per medical doctor',
                    'created': '2012-02-17T17:37:53.911+0000',
                    'lastUpdated': '2013-03-15T15:08:57.709+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Population per medical doctor',
                    'id': 'akiT5Ds3gf7',
                }, {
                    'code': 'IN_52488',
                    'name': 'ANC visits per clinical professional',
                    'created': '2012-02-17T17:32:09.168+0000',
                    'lastUpdated': '2013-03-15T15:08:57.738+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'ANC visits per clinical professional',
                    'id': 'Lzg9LtG1xg3',
                },
            ],
            'indicatorGroupSet': {
                'name': 'Main Indicator Group',
                'created': '2012-02-07T20:49:33.079+0000',
                'lastUpdated': '2013-03-15T15:08:57.863+0000',
                'externalAccess': false,
                'displayName': 'Main Indicator Group',
                'id': 'JqGioeShOKK',
            },
        },
        infrastructuralDataElements: {
            'name': 'Population Estimates',
            'created': '2011-12-24T11:24:24.298+0000',
            'lastUpdated': '2013-03-15T15:08:56.135+0000',
            'externalAccess': false,
            'publicAccess': 'rw------',
            'shortName': 'Population Estimates',
            'displayName': 'Population Estimates',
            'displayShortName': 'Population Estimates',
            'id': 'sP7jTt3YGBb',
            'dataElements': [
                {
                    'code': 'DE_5808',
                    'name': 'Total Population',
                    'created': '2010-02-18T23:52:16.578+0000',
                    'lastUpdated': '2014-11-11T20:56:05.837+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Total Population',
                    'id': 'WUg3MYWQ7pt',
                }, {
                    'code': 'DE_20825',
                    'name': 'Population of women of child bearing age (WRA)',
                    'created': '2010-02-18T23:57:11.546+0000',
                    'lastUpdated': '2014-11-11T20:56:05.916+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Population of women of child bearing age (WRA)',
                    'id': 'vg6pdjObxsm',
                }, {
                    'code': 'DE_20824',
                    'name': 'Total population < 1 year',
                    'created': '2010-02-18T23:52:33.421+0000',
                    'lastUpdated': '2014-11-11T20:56:05.918+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Total population < 1 year',
                    'id': 'DTVRnCGamkV',
                }, {
                    'code': 'DE_20899',
                    'name': 'Expected pregnancies',
                    'created': '2010-02-18T23:55:56.500+0000',
                    'lastUpdated': '2014-11-11T20:56:05.653+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Expected pregnancies',
                    'id': 'h0xKKjijTdI',
                }, {
                    'code': 'DE_20826',
                    'name': 'Total population < 5 years',
                    'created': '2010-02-18T23:52:53.015+0000',
                    'lastUpdated': '2014-11-11T20:56:05.898+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Total population < 5 years',
                    'id': 'DTtCy7Nx5jH',
                },
            ],
        },
        infrastructuralPeriodType: {
            'code': 'Yearly',
            'name': 'Yearly',
            'externalAccess': false,
            'displayName': 'Yearly',
            'id': 'Yearly',
        },
        selfRegistrationRole: {
            'name': 'Facility tracker',
            'created': '2012-11-20T21:07:53.822+0000',
            'lastUpdated': '2014-12-18T20:59:04.378+0000',
            'externalAccess': false,
            'description': 'Tracker user at the facility',
            'authorities': ['F_RELATIONSHIP_ADD', 'F_ANONYMOUS_DATA_ENTRY', 'F_PROGRAM_ENROLLMENT', 'F_TRACKED_ENTITY_COMMENT_DELETE', 'F_SINGLE_EVENT_DATA_ENTRY', 'M_dhis-web-sms', 'F_TRACKED_ENTITY_COMMENT_ADD', 'F_TRACKED_ENTITY_INSTANCE_MANAGEMENT', 'M_dhis-web-visualizer', 'F_TRACKED_ENTITY_INSTANCE_LIST', 'F_SEARCH_TRACKED_ENTITY_INSTANCE_IN_ALL_FACILITIES', 'M_dhis-web-mobile', 'F_ACTIVITY_PLAN', 'F_PROGRAM_INSTANCE_DELETE', 'M_dhis-web-dashboard-integration', 'F_TRACKED_ENTITY_INSTANCE_HISTORY', 'F_TRACKED_ENTITY_INSTANCE_CHANGE_LOCATION', 'F_TRACKED_ENTITY_INSTANCE_ADD', 'F_PROGRAM_TRACKING_MANAGEMENT', 'F_GENERATE_PROGRAM_SUMMARY_REPORT', 'F_MOBILE_SENDSMS', 'F_RELATIONSHIP_DELETE', 'F_TRACKED_ENTITY_INSTANCE_DELETE', 'F_SCHEDULING_SEND_MESSAGE', 'M_dhis-web-pivot', 'F_PROGRAM_TRACKING_SEARCH', 'F_RELATIONSHIP_MANAGEMENT', 'F_GENERATE_BENEFICIARY_TABULAR_REPORT', 'M_dhis-web-caseentry', 'M_dhis-web-light', 'F_TRACKED_ENTITY_INSTANCE_SEARCH', 'F_GENERATE_STATISTICAL_PROGRAM_REPORT', 'F_PROGRAM_INSTANCE_MANAGEMENT', 'F_ADD_PROGRAM_INDICATOR', 'F_PROGRAM_TRACKING_LIST', 'F_PROGRAM_STAGE_INSTANCE_DELETE', 'F_PROGRAM_STAGE_INSTANCE_REMINDER', 'F_PROGRAM_UNENROLLMENT', 'F_ADD_TRACKED_ENTITY_FORM', 'F_TRACKED_ENTITY_DATAVALUE_ADD', 'F_NAME_BASED_DATA_ENTRY', 'M_dhis-web-mapping', 'F_TRACKED_ENTITY_INSTANCE_DASHBOARD', 'F_PROGRAM_STAGE_INSTANCE_SEARCH', 'F_TRACKED_ENTITY_DATAVALUE_DELETE'],
            'displayName': 'Facility tracker',
            'users': [{
                'name': 'John Barnes',
                'created': '2015-03-31T11:31:09.324+0000',
                'lastUpdated': '2015-03-31T11:39:14.763+0000',
                'externalAccess': false,
                'surname': 'Barnes',
                'firstName': 'John',
                'email': 'john@hmail.com',
                'userCredentials': {
                    'code': 'android',
                    'name': 'John Barnes',
                    'created': '2015-03-31T11:31:09.206+0000',
                    'externalAccess': false,
                    'user': {
                        'name': 'John Barnes',
                        'created': '2015-03-31T11:31:09.324+0000',
                        'lastUpdated': '2015-03-31T11:39:14.763+0000',
                        'externalAccess': false,
                        'displayName': 'John Barnes',
                        'id': 'DXyJmlo9rge',
                    },
                    'username': 'android',
                    'passwordLastUpdated': '2015-03-31T11:31:09.206+0000',
                    'lastLogin': '2015-03-31T11:39:21.777+0000',
                    'selfRegistered': false,
                    'invitation': false,
                    'disabled': false,
                    'displayName': 'John Barnes',
                    'userRoles': [{
                        'name': 'Superuser',
                        'created': '2012-11-13T17:10:26.881+0000',
                        'lastUpdated': '2015-04-29T12:20:25.844+0000',
                        'externalAccess': false,
                        'user': {
                            'name': 'Tom Wakiki',
                            'created': '2012-11-21T11:02:04.303+0000',
                            'lastUpdated': '2014-12-19T11:28:37.065+0000',
                            'externalAccess': false,
                            'displayName': 'Tom Wakiki',
                            'id': 'GOLswS44mh8',
                        },
                        'displayName': 'Superuser',
                        'id': 'Ufph3mGRmMo',
                    }, {
                        'name': 'Data entry clerk',
                        'created': '2012-11-13T14:56:57.955+0000',
                        'lastUpdated': '2015-01-20T10:48:11.018+0000',
                        'externalAccess': false,
                        'displayName': 'Data entry clerk',
                        'id': 'Euq3XfEIEbx',
                    }, {
                        'name': 'TB program',
                        'created': '2013-04-09T19:48:27.303+0000',
                        'lastUpdated': '2014-04-30T09:00:20.851+0000',
                        'externalAccess': false,
                        'displayName': 'TB program',
                        'id': 'cUlTcejWree',
                    }, {
                        'name': 'Inpatient program',
                        'created': '2013-04-09T19:47:12.114+0000',
                        'lastUpdated': '2014-11-20T14:57:19.613+0000',
                        'externalAccess': false,
                        'displayName': 'Inpatient program',
                        'id': 'DRdaVRtwmG5',
                    }, {
                        'name': 'M and E Officer',
                        'created': '2012-11-13T11:20:53.017+0000',
                        'lastUpdated': '2015-01-21T20:02:44.955+0000',
                        'externalAccess': false,
                        'displayName': 'M and E Officer',
                        'id': 'jRWSNIHdKww',
                    }, {
                        'name': 'Facility tracker',
                        'created': '2012-11-20T21:07:53.822+0000',
                        'lastUpdated': '2014-12-18T20:59:04.378+0000',
                        'externalAccess': false,
                        'displayName': 'Facility tracker',
                        'id': 'txB7vu1w2Pr',
                    },
                    ],
                },
                'organisationUnits': [{
                    'code': 'OU_559',
                    'name': 'Ngelehun CHC',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2014-11-25T08:37:54.924+0000',
                    'externalAccess': false,
                    'displayName': 'Ngelehun CHC',
                    'id': 'DiszpKrYNg8',
                }],
                'dataViewOrganisationUnits': [{
                    'code': 'OU_539',
                    'name': 'Badjia',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2015-03-27T17:32:48.597+0000',
                    'externalAccess': false,
                    'displayName': 'Badjia',
                    'id': 'YuQRtpLP10I',
                }],
                'displayName': 'John Barnes',
                'id': 'DXyJmlo9rge',
            }, {
                'name': 'Tracker demo User',
                'created': '2012-11-20T21:02:37.342+0000',
                'lastUpdated': '2013-03-06T11:12:00.197+0000',
                'externalAccess': false,
                'surname': 'User',
                'firstName': 'Tracker demo',
                'phoneNumber': '',
                'userCredentials': {
                    'code': 'tracker',
                    'name': 'Tracker demo User',
                    'created': '2012-11-20T21:02:37.332+0000',
                    'externalAccess': false,
                    'user': {
                        'name': 'Tracker demo User',
                        'created': '2012-11-20T21:02:37.342+0000',
                        'lastUpdated': '2013-03-06T11:12:00.197+0000',
                        'externalAccess': false,
                        'displayName': 'Tracker demo User',
                        'id': 'AIK2aQOJIbj',
                    },
                    'username': 'tracker',
                    'passwordLastUpdated': '2013-12-20T19:47:23.000+0000',
                    'lastLogin': '2013-03-06T13:26:53.620+0000',
                    'selfRegistered': false,
                    'invitation': false,
                    'disabled': false,
                    'displayName': 'Tracker demo User',
                    'userRoles': [{
                        'name': 'Facility tracker',
                        'created': '2012-11-20T21:07:53.822+0000',
                        'lastUpdated': '2014-12-18T20:59:04.378+0000',
                        'externalAccess': false,
                        'displayName': 'Facility tracker',
                        'id': 'txB7vu1w2Pr',
                    },
                    ],
                },
                'organisationUnits': [{
                    'code': 'OU_559',
                    'name': 'Ngelehun CHC',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2014-11-25T08:37:54.924+0000',
                    'externalAccess': false,
                    'displayName': 'Ngelehun CHC',
                    'id': 'DiszpKrYNg8',
                }],
                'dataViewOrganisationUnits': [{
                    'code': 'OU_559',
                    'name': 'Ngelehun CHC',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2014-11-25T08:37:54.924+0000',
                    'externalAccess': false,
                    'displayName': 'Ngelehun CHC',
                    'id': 'DiszpKrYNg8',
                }],
                'displayName': 'Tracker demo User',
                'id': 'AIK2aQOJIbj',
            }, {
                'name': 'User Mobile',
                'created': '2012-11-13T15:08:22.136+0000',
                'lastUpdated': '2013-05-29T14:54:33.308+0000',
                'externalAccess': false,
                'surname': 'Mobile',
                'firstName': 'User',
                'email': 'mobile@tmail.com',
                'phoneNumber': '+123456789',
                'jobTitle': 'Community health worker',
                'introduction': 'User of the DHIS 2 mobile client',
                'gender': 'gender_female',
                'birthday': '1987-11-12',
                'nationality': 'Sierra Leone',
                'employer': 'Sierra Leone Ministry of Health',
                'education': 'Diploma',
                'interests': 'Travelling, swimming',
                'languages': 'English',
                'lastCheckedInterpretations': '2013-05-29T14:54:33.308+0000',
                'userCredentials': {
                    'code': 'mobile',
                    'name': 'User Mobile',
                    'externalAccess': false,
                    'user': {
                        'name': 'User Mobile',
                        'created': '2012-11-13T15:08:22.136+0000',
                        'lastUpdated': '2013-05-29T14:54:33.308+0000',
                        'externalAccess': false,
                        'displayName': 'User Mobile',
                        'id': 'PhzytPW3g2J',
                    },
                    'username': 'mobile',
                    'passwordLastUpdated': '2013-12-20T19:47:23.000+0000',
                    'lastLogin': '2013-11-12T13:48:55.892+0000',
                    'selfRegistered': false,
                    'invitation': false,
                    'disabled': false,
                    'displayName': 'User Mobile',
                    'userRoles': [{
                        'name': 'Facility tracker',
                        'created': '2012-11-20T21:07:53.822+0000',
                        'lastUpdated': '2014-12-18T20:59:04.378+0000',
                        'externalAccess': false,
                        'displayName': 'Facility tracker',
                        'id': 'txB7vu1w2Pr',
                    }, {
                        'name': 'Data entry clerk',
                        'created': '2012-11-13T14:56:57.955+0000',
                        'lastUpdated': '2015-01-20T10:48:11.018+0000',
                        'externalAccess': false,
                        'displayName': 'Data entry clerk',
                        'id': 'Euq3XfEIEbx',
                    },
                    ],
                },
                'organisationUnits': [{
                    'code': 'OU_559',
                    'name': 'Ngelehun CHC',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2014-11-25T08:37:54.924+0000',
                    'externalAccess': false,
                    'displayName': 'Ngelehun CHC',
                    'id': 'DiszpKrYNg8',
                }],
                'dataViewOrganisationUnits': [{
                    'code': 'OU_559',
                    'name': 'Ngelehun CHC',
                    'created': '2012-02-17T14:54:39.987+0000',
                    'lastUpdated': '2014-11-25T08:37:54.924+0000',
                    'externalAccess': false,
                    'displayName': 'Ngelehun CHC',
                    'id': 'DiszpKrYNg8',
                }],
                'displayName': 'User Mobile',
                'id': 'PhzytPW3g2J',
                'userGroups': [{
                    'name': 'Africare HQ',
                    'created': '2014-11-03T10:17:10.051+0000',
                    'lastUpdated': '2015-09-09T10:10:39.185+0000',
                    'externalAccess': false,
                    'publicAccess': 'rw------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'Africare HQ',
                    'id': 'vAvEltyXGbD',
                }, {
                    'name': 'Feedback Message Recipients',
                    'created': '2011-12-25T15:52:04.409+0000',
                    'lastUpdated': '2015-09-09T10:10:39.191+0000',
                    'externalAccess': false,
                    'user': {
                        'name': 'John Traore',
                        'created': '2013-04-18T15:15:08.407+0000',
                        'lastUpdated': '2015-09-09T10:10:39.164+0000',
                        'externalAccess': false,
                        'displayName': 'John Traore',
                        'id': 'xE7jOejl9FI',
                    },
                    'displayName': 'Feedback Message Recipients',
                    'id': 'QYrzIjSfI8z',
                }, {
                    'name': 'HIV Program Coordinators',
                    'created': '2013-03-11T17:25:44.229+0000',
                    'lastUpdated': '2015-03-12T09:27:16.440+0000',
                    'externalAccess': false,
                    'publicAccess': 'r-------',
                    'user': {
                        'name': 'Tom Wakiki',
                        'created': '2012-11-21T11:02:04.303+0000',
                        'lastUpdated': '2014-12-19T11:28:37.065+0000',
                        'externalAccess': false,
                        'displayName': 'Tom Wakiki',
                        'id': 'GOLswS44mh8',
                    },
                    'displayName': 'HIV Program Coordinators',
                    'id': 'Rg8wusV7QYi',
                },
                ],
            }],
            'id': 'txB7vu1w2Pr',
        },
        selfRegistrationOrgUnit: {
            'code': 'OU_278371',
            'name': 'Afro Arab Clinic',
            'created': '2012-02-17T14:54:39.987+0000',
            'lastUpdated': '2014-11-25T08:37:53.882+0000',
            'externalAccess': false,
            'shortName': 'Afro Arab Clinic',
            'uuid': '2c1c9166-a2e7-497a-a62c-64568478bc4e',
            'parent': {
                'code': 'OU_278366',
                'name': 'Rural Western Area',
                'created': '2012-02-17T14:54:39.987+0000',
                'lastUpdated': '2014-11-25T08:37:53.242+0000',
                'externalAccess': false,
                'displayName': 'Rural Western Area',
                'id': 'qtr8GGlm4gg',
            },
            'path': '/ImspTQPwCqd/at6UHUQatSo/qtr8GGlm4gg/cDw53Ej8rju',
            'openingDate': '2008-01-01',
            'dataSets': [{
                'code': 'DS_377538',
                'name': 'HIV Peadiatric monthly summary',
                'created': '2012-06-09T19:17:01.656+0000',
                'lastUpdated': '2014-11-11T20:52:48.505+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'HIV Peadiatric monthly summary',
                'id': 'EDzMBk0RRji',
            }, {
                'code': 'DS_217115',
                'name': 'Clinical Monitoring Checklist ',
                'created': '2014-04-25T08:38:13.289+0000',
                'lastUpdated': '2014-04-30T10:53:55.960+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Clinical Monitoring Checklist ',
                'id': 'VTdjfLXXmoi',
            }, {
                'code': 'DS_490350',
                'name': 'Population',
                'created': '2012-07-31T18:58:04.521+0000',
                'lastUpdated': '2014-09-24T09:34:35.458+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Population',
                'id': 'aLpVgfXiz0f',
            }, {
                'code': 'DS_360545',
                'name': 'Staffing',
                'created': '2012-11-14T17:12:41.566+0000',
                'lastUpdated': '2014-11-18T08:46:56.631+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Staffing',
                'id': 'N4fIX1HL3TQ',
            }, {
                'code': 'DS_1148628',
                'name': 'Mortality < 5 years',
                'created': '2011-12-24T11:24:22.881+0000',
                'lastUpdated': '2015-04-09T09:24:23.514+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Mortality < 5 years',
                'id': 'pBOMPrpg1QX',
            }, {
                'code': 'DS_1151032',
                'name': 'MNCH Quarterly Report',
                'created': '2013-04-09T12:21:03.334+0000',
                'lastUpdated': '2013-04-09T12:40:00.675+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'MNCH Quarterly Report',
                'id': 'EKWVBc5C0ms',
            }, {
                'code': 'DS_359711',
                'name': 'Child Health',
                'created': '2012-11-14T17:00:36.863+0000',
                'lastUpdated': '2015-05-03T14:10:20.572+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Child Health',
                'id': 'BfMAe6Itzgt',
            }, {
                'code': 'DS_359593',
                'name': 'Reproductive Health',
                'created': '2012-11-05T14:51:54.891+0000',
                'lastUpdated': '2015-02-24T15:03:36.928+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'userGroupAccesses': [{'access': 'rw------', 'userGroupUid': 'YCPJDwzbe8T'}],
                'displayName': 'Reproductive Health',
                'id': 'QX4ZTUbOt3a',
            }, {
                'code': 'DS_1153709',
                'name': 'Life-Saving Commodities',
                'created': '2014-03-02T01:21:36.553+0000',
                'lastUpdated': '2014-03-03T16:01:18.499+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Life-Saving Commodities',
                'id': 'ULowA8V3ucd',
            }, {
                'code': 'DS_359414',
                'name': 'Morbidity',
                'created': '2012-11-14T17:03:57.069+0000',
                'lastUpdated': '2014-04-06T09:48:59.396+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Morbidity',
                'id': 'eZDhcZi6FLP',
            }, {
                'code': '(TB/HIV)VCCT',
                'name': 'TB/HIV (VCCT) monthly summary',
                'created': '2011-12-24T11:24:22.881+0000',
                'lastUpdated': '2013-04-09T19:41:39.734+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'TB/HIV (VCCT) monthly summary',
                'id': 'OsPTWNqq26W',
            }, {
                'code': 'DS_1149441',
                'name': 'EPI Stock',
                'created': '2012-11-14T16:58:46.725+0000',
                'lastUpdated': '2014-11-21T10:39:48.041+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'EPI Stock',
                'id': 'TuL8IOPzpHh',
            }, {
                'code': 'DS_1151033',
                'name': 'Inpatient Morbidity/Mortality Summary',
                'created': '2013-04-09T12:21:37.532+0000',
                'lastUpdated': '2013-04-09T12:53:59.971+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Inpatient Morbidity/Mortality Summary',
                'id': 'PLq9sJluXvc',
            }, {
                'code': 'DS_543073',
                'name': 'TB Facility reporting Form',
                'created': '2012-07-31T20:06:02.388+0000',
                'lastUpdated': '2014-11-18T08:53:34.046+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'TB Facility reporting Form',
                'id': 'SF8FDSqw30D',
            }, {
                'code': 'DS_1151444',
                'name': 'Facility Assessment',
                'created': '2013-05-29T20:50:29.352+0000',
                'lastUpdated': '2015-03-26T18:15:45.550+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Facility Assessment',
                'id': 'V8MHeZHIrcP',
            }, {
                'name': 'Mortality < 5 years Narratives',
                'created': '2014-11-19T13:01:50.578+0000',
                'lastUpdated': '2014-11-19T13:05:34.742+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Mortality < 5 years Narratives',
                'id': 'YZhd4nu3mzY',
            }, {
                'code': 'DS_363642',
                'name': 'PMTCT monthly summary',
                'created': '2011-12-24T11:24:22.881+0000',
                'lastUpdated': '2013-10-16T15:47:40.718+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'PMTCT monthly summary',
                'id': 'Rl58JxmKJo2',
            }, {
                'code': 'DS_394131',
                'name': 'ART monthly summary',
                'created': '2012-06-09T22:36:10.036+0000',
                'lastUpdated': '2014-07-21T10:21:26.555+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'userGroupAccesses': [{'access': 'rw------', 'userGroupUid': 'L4XTzgbdza3'}],
                'displayName': 'ART monthly summary',
                'id': 'lyLU2wR22tC',
            }],
            'programs': [{
                'name': 'Information Campaign',
                'created': '2014-06-22T11:28:24.004+0000',
                'lastUpdated': '2014-06-22T11:28:56.127+0000',
                'externalAccess': false,
                'publicAccess': 'rw------',
                'user': {
                    'name': 'Tom Wakiki',
                    'created': '2012-11-21T11:02:04.303+0000',
                    'lastUpdated': '2014-12-19T11:28:37.065+0000',
                    'externalAccess': false,
                    'displayName': 'Tom Wakiki',
                    'id': 'GOLswS44mh8',
                },
                'displayName': 'Information Campaign',
                'id': 'q04UBOqq3rp',
            }, {
                'name': 'Child Programme',
                'created': '2013-03-04T10:41:07.494+0000',
                'lastUpdated': '2014-01-09T18:11:38.621+0000',
                'externalAccess': false,
                'displayName': 'Child Programme',
                'id': 'IpHINAT79UW',
            }, {
                'name': 'TB program',
                'created': '2013-03-04T10:41:07.494+0000',
                'lastUpdated': '2014-07-18T15:11:14.347+0000',
                'externalAccess': false,
                'displayName': 'TB program',
                'id': 'ur1Edk5Oe2n',
            }, {
                'name': 'MNCH / PNC (Adult Woman)',
                'created': '2013-03-04T10:41:07.494+0000',
                'lastUpdated': '2015-01-20T18:59:02.839+0000',
                'externalAccess': false,
                'displayName': 'MNCH / PNC (Adult Woman)',
                'id': 'uy2gU8kT1jF',
            }, {
                'name': 'Inpatient morbidity and mortality',
                'created': '2013-03-04T10:41:07.494+0000',
                'lastUpdated': '2013-05-30T08:25:45.919+0000',
                'externalAccess': false,
                'displayName': 'Inpatient morbidity and mortality',
                'id': 'eBAyeGv0exc',
            }],
            'displayName': 'Afro Arab Clinic',
            'level': 4,
            'displayShortName': 'Afro Arab Clinic',
            'id': 'cDw53Ej8rju',
            'organisationUnitGroups': [{
                'name': 'Urban',
                'created': '2013-03-06T15:46:20.584+0000',
                'lastUpdated': '2013-03-06T15:46:20.584+0000',
                'externalAccess': false,
                'displayName': 'Urban',
                'id': 'f25dqv3Y7Z0',
            }, {
                'code': 'Clinic',
                'name': 'Clinic',
                'created': '2012-11-13T13:36:04.762+0000',
                'lastUpdated': '2013-09-25T15:53:24.301+0000',
                'externalAccess': false,
                'displayName': 'Clinic',
                'id': 'RXL3lPSK8oG',
            },
            ],
        },
    };

    beforeEach(() => {
        configuration = new SystemConfiguration();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => SystemConfiguration()).to.throw('Cannot call a class as a function');
    });

    it('should set an instance of Api onto the SystemConfiguration instance', () => {
        expect(configuration.api).to.be.instanceof(Api);
    });

    it('all() should be a function', () => {
        expect(configuration.all).to.be.instanceOf(Function);
    });

    it('get() should be a function', () => {
        expect(configuration.get).to.be.instanceOf(Function);
    });

    describe('API call', () => {
        beforeEach(() => {
            stub = sinon.stub(configuration.api, 'get');
            stub.withArgs('configuration/systemId').returns(Promise.resolve(mockConfiguration.systemId));
            stub.withArgs('configuration/feedbackRecipients').returns(Promise.resolve(mockConfiguration.feedbackRecipients));
            stub.withArgs('configuration/offlineOrganisationUnitLevel').returns(Promise.resolve(mockConfiguration.offlineOrganisationUnitLevel));
            stub.withArgs('configuration/infrastructuralIndicators').returns(Promise.resolve(mockConfiguration.infrastructuralIndicators));
            stub.withArgs('configuration/infrastructuralDataElements').returns(Promise.resolve(mockConfiguration.infrastructuralDataElements));
            stub.withArgs('configuration/infrastructuralPeriodType').returns(Promise.resolve(mockConfiguration.infrastructuralPeriodType));
            stub.withArgs('configuration/selfRegistrationRole').returns(Promise.resolve(mockConfiguration.selfRegistrationRole));
            stub.withArgs('configuration/selfRegistrationOrgUnit').returns(Promise.resolve(mockConfiguration.selfRegistrationOrgUnit));
            stub.throws();
        });

        afterEach(() => {
            stub.restore();
        });

        describe('.all()', () => {
            it('should return the entire config', (done) => {
                configuration.all().then((res) => {
                    expect(res).to.eql(mockConfiguration);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API for all configuration endpoints', (done) => {
                configuration.all();

                expect(stub.callCount).to.equal(8);
                expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                expect(stub.withArgs('configuration/feedbackRecipients').callCount).to.equal(1);
                expect(stub.withArgs('configuration/offlineOrganisationUnitLevel').callCount).to.equal(1);
                expect(stub.withArgs('configuration/infrastructuralIndicators').callCount).to.equal(1);
                expect(stub.withArgs('configuration/infrastructuralDataElements').callCount).to.equal(1);
                expect(stub.withArgs('configuration/infrastructuralPeriodType').callCount).to.equal(1);
                expect(stub.withArgs('configuration/selfRegistrationRole').callCount).to.equal(1);
                expect(stub.withArgs('configuration/selfRegistrationOrgUnit').callCount).to.equal(1);
                done();
            });

            it('should only call the API once', (done) => {
                configuration.all().then(() => {
                    configuration.all().then(() => {
                        expect(stub.callCount).to.equal(8);
                        expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/feedbackRecipients').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/offlineOrganisationUnitLevel').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/infrastructuralIndicators').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/infrastructuralDataElements').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/infrastructuralPeriodType').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/selfRegistrationRole').callCount).to.equal(1);
                        expect(stub.withArgs('configuration/selfRegistrationOrgUnit').callCount).to.equal(1);
                        done();
                    });
                    expect(stub.callCount).to.equal(8);
                    expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/feedbackRecipients').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/offlineOrganisationUnitLevel').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralIndicators').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralDataElements').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralPeriodType').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/selfRegistrationRole').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/selfRegistrationOrgUnit').callCount).to.equal(1);
                });
            });

            it('should call the API again if ignoreCache is true', (done) => {
                configuration.all(true).then(() => {
                    configuration.all(true).then(() => {
                        expect(stub.callCount).to.equal(16);
                        expect(stub.withArgs('configuration/systemId').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/feedbackRecipients').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/offlineOrganisationUnitLevel').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/infrastructuralIndicators').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/infrastructuralDataElements').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/infrastructuralPeriodType').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/selfRegistrationRole').callCount).to.equal(2);
                        expect(stub.withArgs('configuration/selfRegistrationOrgUnit').callCount).to.equal(2);
                        done();
                    });
                    expect(stub.callCount).to.equal(8);
                    expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/feedbackRecipients').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/offlineOrganisationUnitLevel').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralIndicators').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralDataElements').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/infrastructuralPeriodType').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/selfRegistrationRole').callCount).to.equal(1);
                    expect(stub.withArgs('configuration/selfRegistrationOrgUnit').callCount).to.equal(1);
                });
            });
        });

        describe('.get()', () => {
            it('should return the correct systemId', (done) => {
                configuration.get('systemId').then((res) => {
                    expect(res).to.equal(mockConfiguration.systemId);
                    done();
                }, (err) => {
                    done(err);
                });
            });

            it('should return the correct feedback recipient user group', () => {
                configuration.get('feedbackRecipients').then((res) => {
                    expect(res).to.equal(mockConfiguration.feedbackRecipients);
                }, (err) => {
                    done(err);
                });
            });

            it('should only query the API once', (done) => {
                configuration.get('systemId').then(() => {
                    configuration.get('systemId').then((res) => {
                        expect(res).to.equal(mockConfiguration.systemId);
                        expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                        done();
                    }, (err) => {
                        done(err);
                    });
                    expect(res).to.equal(mockConfiguration.systemId);
                    expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                }, (err) => {
                    done(err);
                });
            });

            it('should query the API twice if ignoreCache is true', (done) => {
                configuration.get('systemId', true).then(() => {
                    configuration.get('systemId', true).then((res) => {
                        expect(res).to.equal(mockConfiguration.systemId);
                        expect(stub.withArgs('configuration/systemId').callCount).to.equal(2);
                        done();
                    }, (err) => {
                        done(err);
                    });
                    expect(res).to.equal(mockConfiguration.systemId);
                    expect(stub.withArgs('configuration/systemId').callCount).to.equal(1);
                }, (err) => {
                    done(err);
                });
            });
        });

    });
});
