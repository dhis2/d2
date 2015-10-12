/**
 * This file provides information about DHIS2 system settings and configuration options that are not otherwise
 * available through the API.
 * </p>
 * Each system settings key is mapped to an I18N label and (optional) description. In addition, certain special system
 * settings that are not actually saved as system settings but rather as system configuration options are described
 * here as well. This concerns any key that has a "configuration" property, where the configuration property specifies
 * the name of the configuration API end point for reading and updating the setting in question.
 * </p>
 * Settings that have an `appendLocale: true` property, are localizable settings. When these settings are saved, the
 * code of the specified locale, such as "fr" or "ar_IQ" is appended to the key name.
 *
 * @type {{settingsKey: {label: string, description: string, configuration: string, appendLocale: boolean}}}
 */
const settingsKeyMapping = {
    /* ============================================================================================================ */
    /* Category: General                                                                                            */
    /* ============================================================================================================ */
    'keyCacheStrategy': {
        label: 'cache_strategy',
        type: 'dropdown',
        options: {
            'NO_CACHE': 'no_cache',
            'CACHE_1_HOUR': 'cache_for_one_hour',
            'CACHE_6AM_TOMORROW': 'cache_until_6am_tomorrow',
            'CACHE_TWO_WEEKS': 'cache_for_two_weeks',
        },
    },
    'keyAnalyticsMaxLimit': {
        label: 'analytics_max_limit',
        type: 'dropdown',
        options: {
            50000: 50000,
            100000: 100000,
            200000: 200000,
            0: 'unlimited',
        },
    },
    'keyDatabaseServerCpus': {
        label: 'no_of_database_server_cpus',
        type: 'dropdown',
        options: {
            0: 'detect_based_on_web_server',
            1: '1', 2: '2', 3: '3', 4: '4', 5: '5',
            6: '6', 7: '7', 8: '8', 16: '16', 32: '32',
        },
    },
    'infrastructuralIndicators': {
        label: 'infrastructural_indicators',
        configuration: 'infrastructuralIndicators',
        type: 'indicatorGroups',
    },
    'infrastructuralDataElements': {
        label: 'infrastructural_data_elements',
        configuration: 'infrastructuralDataElements',
        type: 'dataElementGroups',
    },
    'infrastructuralPeriodType': {
        label: 'infrastructural_period_type',
        configuration: 'infrastructuralPeriodType',
        type: 'dropdown',
        options: {
            'Daily': 'Daily',
            'Weekly': 'Weekly',
            'Monthly': 'Monthly',
            'BiMonthly': 'BiMonthly',
            'Quarterly': 'Quarterly',
            'SixMonthly': 'SixMonthly',
            'SixMonthlyApril': 'SixMonthlyApril',
            'Yearly': 'yearly',
            'FinancialApril': 'FinancialApril',
            'FinancialJuly': 'FinancialJuly',
            'FinancialOct': 'FinancialOct',
        },
    },
    'keyAnalysisRelativePeriod': {
        label: 'default_analysis_relative_period',
        type: 'dropdown',
        options: {
            THIS_MONTH: 'THIS_MONTH',
            LAST_MONTH: 'LAST_MONTH',
            THIS_BIMONTH: 'THIS_BIMONTH',
            LAST_BIMONTH: 'LAST_BIMONTH',
            THIS_QUARTER: 'THIS_QUARTER',
            LAST_QUARTER: 'LAST_QUARTER',
            THIS_SIX_MONTH: 'THIS_SIX_MONTH',
            LAST_SIX_MONTH: 'LAST_SIX_MONTH',
            MONTHS_THIS_YEAR: 'MONTHS_THIS_YEAR',
            QUARTERS_THIS_YEAR: 'QUARTERS_THIS_YEAR',
            THIS_YEAR: 'THIS_YEAR',
            MONTHS_LAST_YEAR: 'MONTHS_LAST_YEAR',
            QUARTERS_LAST_YEAR: 'QUARTERS_LAST_YEAR',
            LAST_YEAR: 'LAST_YEAR',
            LAST_5_YEARS: 'LAST_5_YEARS',
            LAST_12_MONTHS: 'LAST_12_MONTHS',
            LAST_6_MONTHS: 'LAST_6_MONTHS',
            LAST_3_MONTHS: 'LAST_3_MONTHS',
            LAST_6_BIMONTHS: 'LAST_6_BIMONTHS',
            LAST_4_QUARTERS: 'LAST_4_QUARTERS',
            LAST_2_SIXMONTHS: 'LAST_2_SIXMONTHS',
            THIS_FINANCIAL_YEAR: 'THIS_FINANCIAL_YEAR',
            LAST_FINANCIAL_YEAR: 'LAST_FINANCIAL_YEAR',
            LAST_5_FINANCIAL_YEARS: 'LAST_5_FINANCIAL_YEARS',
            THIS_WEEK: 'THIS_WEEK',
            LAST_WEEK: 'LAST_WEEK',
            LAST_4_WEEKS: 'LAST_4_WEEKS',
            LAST_12_WEEKS: 'LAST_12_WEEKS',
            LAST_52_WEEKS: 'LAST_52_WEEKS',
        },
    },
    'feedbackRecipients': {
        label: 'feedback_recipients',
        configuration: 'feedbackRecipients',
        type: 'userGroups',
    },
    'offlineOrganisationUnitLevel': {
        label: 'max_levels_to_offline',
        description: 'relative_to_current_user',
        configuration: 'offlineOrganisationUnitLevel',
        type: 'organisationUnitLevels',
    },
    'keySystemNotificationsEmail': {
        label: 'system_notifications_email_address',
        validators: ['email'],
    },
    'factorDeviation': {
        label: 'data_analysis_factor',
        validators: ['number'],
    },
    'phoneNumberAreaCode': {
        label: 'phone_number_area_code',
        validators: ['number'],
    },
    'helpPageLink': {
        label: 'help_page_link',
        validators: ['url'],
    },
    'keyInstanceBaseUrl': {
        label: 'server_base_url',
        validators: ['url'],
    },
    'googleAnalyticsUA': {
        label: 'google_analytics_ua_key',
    },
    'multiOrganisationUnitForms': {
        label: 'multi_organisation_unit_forms',
        type: 'checkbox',
    },
    'omitIndicatorsZeroNumeratorDataMart': {
        label: 'omit_indicators_zero_numerator_data_mart',
        type: 'checkbox',
    },
    'keyAnalyticsMaintenanceMode': {
        label: 'put_analytics_in_maintenance_mode',
        type: 'checkbox',
    },
    /* ============================================================================================================ */
    /* Category: Appearance                                                                                         */
    /* ============================================================================================================ */
    'applicationTitle': {
        label: 'application_title',
        appendLocale: true,
    },
    'keyApplicationIntro': {
        label: 'application_introduction',
        description: 'allows_html',
        appendLocale: true,
        multiLine: true,
    },
    'keyApplicationNotification': {
        label: 'application_notification',
        description: 'allows_html',
        appendLocale: true,
        multiLine: true,
    },
    'keyApplicationFooter': {
        label: 'application_left_footer',
        description: 'allows_html',
        appendLocale: true,
        multiLine: true,
    },
    'keyApplicationRightFooter': {
        label: 'application_right_footer',
        description: 'allows_html',
        appendLocale: true,
        multiLine: true,
    },
    'currentStyle': {
        label: 'style',
        type: 'dropdown',
        options: {
            'light_blue/light_blue.css': 'light_blue',
            'green/green.css': 'green',
            'myanmar/myanmar.css': 'myanmar',
            'vietnam/vietnam.css': 'vietnam',
            'india/india.css': 'india',
        },
    },
    'startModule': {label: 'start_page'},
    'keyFlag': {
        label: 'flag',
        type: 'dropdown',
        options: {
            'afghanistan': 'afghanistan',
            'africare': 'africare',
            'akros': 'akros',
            'algeria': 'algeria',
            'armenia': 'armenia',
            'bangladesh': 'bangladesh',
            'benin': 'benin',
            'bhutan': 'bhutan',
            'botswana': 'botswana',
            'burkina_faso': 'burkina_faso',
            'burkina_faso_coat_of_arms': 'burkina_faso_coat_of_arms',
            'burundi': 'burundi',
            'cambodia': 'cambodia',
            'cameroon': 'cameroon',
            'china': 'china',
            'colombia': 'colombia',
            'congo_brazzaville': 'congo_brazzaville',
            'congo_kinshasa': 'congo_kinshasa',
            'demoland': 'demoland',
            'ecowas': 'ecowas',
            'ecuador': 'ecuador',
            'east_africa_community': 'east_africa_community',
            'egypt': 'egypt',
            'engender_health': 'engender_health',
            'ethiopia': 'ethiopia',
            'fhi360': 'fhi360',
            'forut': 'forut',
            'gambia': 'gambia',
            'ghana': 'ghana',
            'global_fund': 'global_fund',
            'guinea': 'guinea',
            'guinea_bissau': 'guinea_bissau',
            'haiti': 'haiti',
            'icap': 'icap',
            'ippf': 'ippf',
            'india': 'india',
            'indonesia': 'indonesia',
            'irc': 'irc',
            'iraq': 'iraq',
            'ivory_coast': 'ivory_coast',
            'jhpiego': 'jhpiego',
            'kenya': 'kenya',
            'laos': 'laos',
            'lesotho': 'lesotho',
            'liberia': 'liberia',
            'malawi': 'malawi',
            'mongolia': 'mongolia',
            'mozambique': 'mozambique',
            'myanmar': 'myanmar',
            'mali': 'mali',
            'msf': 'msf',
            'msi': 'msi',
            'namibia': 'namibia',
            'nicaragua': 'nicaragua',
            'nepal': 'nepal',
            'niger': 'niger',
            'nigeria': 'nigeria',
            'norway': 'norway',
            'pakistan': 'pakistan',
            'palestine': 'palestine',
            'paraguay': 'paraguay',
            'philippines': 'philippines',
            'pepfar': 'pepfar',
            'peru': 'peru',
            'psi': 'psi',
            'rwanda': 'rwanda',
            'senegal': 'senegal',
            'sierra_leone': 'sierra_leone',
            'sierra_leone_coat_of_arms': 'sierra_leone_coat_of_arms',
            'solomon_islands': 'solomon_islands',
            'south_africa': 'south_africa',
            'south_africa_department_of_health': 'south_africa_department_of_health',
            'south_sudan': 'south_sudan',
            'sri_lanka': 'sri_lanka',
            'sudan': 'sudan',
            'swaziland': 'swaziland',
            'tajikistan': 'tajikistan',
            'tanzania': 'tanzania',
            'timor_leste': 'timor_leste',
            'republic_of_trinidad_and_tobago': 'republic_of_trinidad_and_tobago',
            'togo': 'togo',
            'uganda': 'uganda',
            'usaid': 'usaid',
            'vietnam': 'vietnam',
            'vanuatu': 'vanuatu',
            'zambia': 'zambia',
            'zanzibar': 'zanzibar',
            'zimbabwe': 'zimbabwe',
            'who': 'who',
        },
    },
    'keyRequireAddToView': {
        label: 'require_authority_to_add_to_view_object_lists',
        type: 'checkbox',
    },
    'keyCustomLoginPageLogo': {
        label: 'custom_login_page_logo',
        type: 'checkbox',
    },
    'keyCustomTopMenuLogo': {
        label: 'custom_top_menu_logo',
        type: 'checkbox',
    },
    /* ============================================================================================================ */
    /* Category: Email                                                                                              */
    /* ============================================================================================================ */
    'keyEmailHostName': {label: 'host_name'},
    'keyEmailPort': {
        label: 'port',
    },
    'keyEmailUsername': {
        label: 'username',
    },
    'keyEmailPassword': {
        label: 'password',
        configuration: 'smtpPassword',
        type: 'password',
    },
    'keyEmailTls': {
        label: 'tls',
        type: 'checkbox',
    },
    'keyEmailSender': {label: 'email_sender'},
    /* ============================================================================================================ */
    /* Category: Access                                                                                             */
    /* ============================================================================================================ */
    'selfRegistrationRole': {
        label: 'self_registration_account_user_role',
        configuration: 'selfRegistrationRole',
        type: 'userRoles',
    },
    'keySelfRegistrationNoRecaptcha': {
        label: 'do_not_require_recaptcha_for_self_registration',
        type: 'checkbox',
    },
    'selfRegistrationOrgUnit': {
        label: 'self_registration_account_organisation_unit',
        configuration: 'selfRegistrationOrgUnit',
        type: 'organisationUnits',
    },
    'keyAccountRecovery': {
        label: 'enable_user_account_recovery',
        type: 'checkbox',
    },
    'keyCanGrantOwnUserAuthorityGroups': {
        label: 'allow_users_to_grant_own_user_roles',
        type: 'checkbox',
    },
    'keyAllowObjectAssignment': {
        label: 'allow_assigning_object_to_related_objects_during_add_or_update',
        type: 'checkbox',
    },
    'credentialsExpires': {
        label: 'user_credentials_expires',
        type: 'dropdown',
        options: {
            0: 'never',
            3: '3_months',
            6: '6_months',
            12: '12_months',
        },
    },
    'keyOpenIdProvider': {label: 'openid_provider'},
    'keyOpenIdProviderLabel': {label: 'openid_provider_label'},
    'corsWhitelist': {
        label: 'cors_whitelist',
        configuration: 'corsWhitelist',
        type: 'editlist',
        multiLine: true,
    },
    /* ============================================================================================================ */
    /* Category: Approval                                                                                           */
    /* ============================================================================================================ */
    'keyHideUnapprovedDataInAnalytics': {
        label: 'hide_unapproved_data_in_analytics',
        type: 'checkbox',
    },
    'keyAcceptanceRequiredForApproval': {
        label: 'acceptance_required_before_approval',
        type: 'checkbox',
    },
    'dataApprovalLevels': {
        label: 'data_approval_levels',
        type: 'dataapproval',
    },
    /* ============================================================================================================ */
    /* Category: Calendar                                                                                           */
    /* ============================================================================================================ */
    'keyCalendar': {
        label: 'calendar',
        type: 'dropdown',
        options: {
            'coptic': 'coptic',
            'ethiopian': 'ethiopian',
            'gregorian': 'gregorian',
            'islamic': 'islamic',
            'iso8601': 'iso8601',
            'julian': 'julian',
            'nepali': 'nepali',
            'thai': 'thai',
        },
    },
    'keyDateFormat': {
        label: 'date_format',
        type: 'dropdown',
        options: {
            'yyyy-MM-dd': 'yyyy-MM-dd',
            'dd-MM-yyyy': 'dd-MM-yyyy',
        },
    },
    /* ============================================================================================================ */
    /* Category: Calendar                                                                                           */
    /* ============================================================================================================ */
    'remoteServerUrl': {
        label: 'remote_server_url',
        configuration: 'remoteServerUrl',
    },
    'remoteServerUsername': {
        label: 'remote_server_username',
        configuration: 'remoteServerUsername',
    },
    'remoteServerPassword': {
        label: 'remote_server_password',
        configuration: 'remoteServerPassword',
        type: 'password',
    },
    /* ============================================================================================================ */
    /* Category: Data Import                                                                                        */
    /* ============================================================================================================ */
    'keyDataImportStrictPeriods': {
        label: 'require_periods_to_match_period_type',
        type: 'checkbox',
    },
    'keyDataImportStrictCategoryOptionCombos': {
        label: 'require_category_option_combos_to_match',
        type: 'checkbox',
    },
    'keyDataImportStrictOrganisationUnits': {
        label: 'require_organisation_units_to_match_assignment',
        type: 'checkbox',
    },
    'keyDataImportStrictAttributeOptionCombos': {
        label: 'require_attribute_option_combos_to_match',
        type: 'checkbox',
    },
    'keyDataImportRequireCategoryOptionCombo': {
        label: 'require_category_option_combo_to_be_specified',
        type: 'checkbox',
    },
    'keyDataImportRequireAttributeOptionCombo': {
        label: 'require_attribute_option_combo_to_be_specified',
        type: 'checkbox',
    },
    /* ============================================================================================================ */
    /* Category: oAuth2 clients                                                                                     */
    /* ============================================================================================================ */
    'oauth2clients': {
        label: 'oauth2clients',
        type: 'oauth2clients',
    },

    /* ============================================================================================================ */
    // The following keys are present in the demo database but are not managed by dhis-web-maintenance-settings
    //
    // 'sendMessageScheduled'
    // 'timeSendingMessage'
    // 'keyCustomCss'
    // 'aggregationStrategy'
    // 'zeroValueSaveMode'
    // 'reportFramework'
    // 'systemSettings'
    // 'keyLastSuccessfulSynch'
    // 'dataEntryFormCompleted'
    // 'keyTrackerDashboardDefaultLayout'
    // 'keyLastSuccessfulAnalyticsTablesUpdate'
    // 'SMS_CONFIG'
    // 'orgUnitGroupSetAggregationLevel'
    // 'keyScheduledPeriodTypes'
    // 'keyLastSuccessfulResourceTablesUpdate'
    // 'keySchedTasks'
    // 'applicationIntro'
    // 'systemTitle'
    // 'keyAccountInvite'
    // 'flag'
    // 'scheduleAggregateQueryBuilderTackStrategy'
    // 'appBaseUrl'
    // 'mysetting'
    // 'appFolderPath'
    // 'keySystemIdentifier'
    // 'keyScheduledTasks'
    // 'keyLastSuccessfulDataSynch'
    // 'appStoreUrl'
    // 'App_TabularData_SettingData'
    // 'keyLastMonitoringRun'
    // 'scheduleAggregateQueryBuilder'
    // 'keyDataSetCompletenessTask'
    // 'keyDataMartTask'
};

export default settingsKeyMapping;
