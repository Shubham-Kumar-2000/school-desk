module.exports = {
    AUTH_TOKEN_EXPIRY_HOURS: 20,
    ADMIN_AUTH_SESSION_EXPIRY_HOURS: 24 * 60 * 60,
    ERROR_TYPES: {
        VALIDATION: 'Validation',
        CUSTOM: 'Custom',
        HTTP: 'HTTP',
        UNEXPECTED: 'Unexpected'
    },
    USER_STATUS: {
        BLOCKED: 'BLOCKED',
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
        DELETED: 'DELETED'
    },
    USER_PLAN_STATUS: {
        ACTIVE: 1,
        DISABLED: -1
    },

    NOTIF_PAGINATION_LIMIT: 30,
    USERS_PAGINATION_LIMIT: 20,

    DAYS_OF_WEEK: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],

    SUPPORTED_LANGUAGES: {
        English: {
            key: 'English',
            bcp_code: 'en-US',
            indic_trans_code: 'en',
            reminderText: 'Reminder'
        },
        Hindi: {
            key: 'Hindi',
            bcp_code: 'hi-IN',
            indic_trans_code: 'hi',
            reminderText: 'अनुस्मारक'
        }
    },

    NOTICE_TYPES: {
        INFO: 'INFO',
        COMPLAINS: 'COMPLAINS',
        EVENTS: 'EVENTS',
        SCHOLARSHIPS: 'SCHOLARSHIPS',
        ADMINISTRATIVE: 'ADMINISTRATIVE'
    },

    TARGET_AUDIENCE_TYPES: {
        STUDENT: 'STUDENT',
        GROUP_OF_STUDENTS: 'GROUP_OF_STUDENTS',
        CLASS: 'CLASS',
        ALL: 'ALL'
    },

    IDENTITY_TYPES: {
        AADHAR: {
            key: 'AADHAR',
            regex: /^[2-9]{1}[0-9]{11}$/
        },
        PAN: {
            key: 'PAN',
            regex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
        },
        DRIVING_LICENSE: {
            key: 'DRIVING_LICENSE',
            regex: /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/
        },
        PASSPORT: {
            key: 'PASSPORT',
            regex: /[A-Z][1-9]\d\s?\d{4}[1-9]$/
        }
    },

    GENDERS: {
        MALE: 'MALE',
        FEMALE: 'FEMALE'
    },

    KAFKA_TOPICS: {
        query_response: 'query-response',
        notice: 'notice',
        reminder: 'reminder',
        result: 'result'
    },

    SCHEDULER_INTERVAL: 60 * 1000
};
