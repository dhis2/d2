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
    'keyCacheStrategy': {label: 'cache_strategy'},
    'keyAnalyticsMaxLimit': {label: 'analytics_max_limit'},
    'keyDatabaseServerCpus': {label: 'no_of_database_server_cpus'},
    'infrastructuralIndicators': {
        label: 'infrastructural_indicators',
        configuration: 'infrastructuralIndicators',
    },
    'infrastructuralDataElements': {
        label: 'infrastructural_data_elements',
        configuration: 'infrastructuralDataElements',
    },
    'infrastructuralPeriodType': {
        label: 'infrastructural_period_type',
        configuration: 'infrastructuralPeriodType',
    },
    'keyAnalysisRelativePeriod': {label: 'default_analysis_relative_period'},
    'feedbackRecipients': {
        label: 'feedback_recipients',
        configuration: 'feedbackRecipients',
    },
    'offlineOrganisationUnitLevel': {
        label: 'max_levels_to_offline',
        description: 'relative_to_current_user',
        configuration: 'offlineOrganisationUnitLevel',
    },
    'keySystemNotificationsEmail': {label: 'system_notifications_email_address'},
    'factorDeviation': {label: 'data_analysis_factor'},
    'phoneNumberAreaCode': {label: 'phone_number_area_code'},
    'helpPageLink': {label: 'help_page_link'},
    'keyInstanceBaseUrl': {label: 'server_base_url'},
    'googleAnalyticsUA': {label: 'google_analytics_ua_key'},
    'multiOrganisationUnitForms': {label: 'multi_organisation_unit_forms'},
    'omitIndicatorsZeroNumeratorDataMart': {label: 'omit_indicators_zero_numerator_data_mart'},
    'keyAnalyticsMaintenanceMode': {label: 'put_analytics_in_maintenance_mode'},
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
    },
    'keyApplicationNotification': {
        label: 'application_notification',
        description: 'allows_html',
        appendLocale: true,
    },
    'keyApplicationFooter': {
        label: 'application_left_footer',
        description: 'allows_html',
        appendLocale: true,
    },
    'keyApplicationRightFooter': {
        label: 'application_right_footer',
        description: 'allows_html',
        appendLocale: true,
    },
    'currentStyle': {label: 'style'},
    'startModule': {label: 'start_page'},
    'keyFlag': {label: 'flag'},
    'keyRequireAddToView': {label: 'require_authority_to_add_to_view_object_lists'},
    'keyCustomLoginPageLogo': {label: 'custom_login_page_logo'},
    'keyCustomTopMenuLogo': {label: 'custom_top_menu_logo'},
    /* ============================================================================================================ */
    /* Category: Email                                                                                              */
    /* ============================================================================================================ */
    'keyEmailHostName': {label: 'host_name'},
    'keyEmailPort': {label: 'port'},
    'keyEmailUsername': {label: 'username'},
    // 'keyEmailPassword': {label: 'password'},
    'keyEmailTls': {label: 'tls'},
    'keyEmailSender': {label: 'email_sender'},
    /* ============================================================================================================ */
    /* Category: Access                                                                                             */
    /* ============================================================================================================ */
    'selfRegistrationRole': {
        label: 'self_registration_account_user_role',
        configuration: 'selfRegistrationRole',
    },
    'keySelfRegistrationNoRecaptcha': {label: 'do_not_require_recaptcha_for_self_registration'},
    'selfRegistrationOrgUnit': {
        label: 'self_registration_account_organisation_unit',
        configuration: 'selfRegistrationOrgUnit',
    },
    'keyAccountRecovery': {label: 'enable_user_account_recovery'},
    'keyCanGrantOwnUserAuthorityGroups': {label: 'allow_users_to_grant_own_user_roles'},
    'keyAllowObjectAssignment': {
        label: 'allow_assigning_object_to_related_objects_during_add_or_update',
    },
    'credentialsExpires': {label: 'user_credentials_expires'},
    'keyOpenIdProvider': {label: 'openid_provider'},
    'keyOpenIdProviderLabel': {label: 'openid_provider_label'},
    'keyCorsWhitelist': {label: 'cors_whitelist'},
    /* ============================================================================================================ */
    /* Category: Approval                                                                                           */
    /* ============================================================================================================ */
    'keyHideUnapprovedDataInAnalytics': {label: 'hide_unapproved_data_in_analytics'},
    'keyAcceptanceRequiredForApproval': {label: 'acceptance_required_before_approval'},
    /* ============================================================================================================ */
    /* Category: Calendar                                                                                           */
    /* ============================================================================================================ */
    'keyCalendar': {label: 'calendar'},
    'keyDateFormat': {label: 'date_format'},

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
