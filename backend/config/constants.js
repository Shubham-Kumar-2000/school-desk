module.exports = {
    AUTH_TOKEN_EXPIRY_HOURS: 200,
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
        },
        Sanskrit: {
            key: 'Sanskrit',
            bcp_code: 'sa-IN',
            indic_trans_code: 'sa',
            reminderText: 'स्मरणपत्रम्'
        },
        Odia: {
            key: 'Odia',
            bcp_code: 'or-IN',
            indic_trans_code: 'or',
            reminderText: 'ମନେ ପକାନ୍ତୁ'
        },
        Kashmiri: {
            key: 'Kashmiri',
            bcp_code: 'ks-IN',
            indic_trans_code: 'ks',
            reminderText: 'یاد دہانی'
        },
        Dogri: {
            key: 'Dogri',
            bcp_code: 'doi-IN',
            indic_trans_code: 'doi',
            reminderText: 'याद दहानी'
        },
        Gujarati: {
            key: 'Gujarati',
            bcp_code: 'gu-IN',
            indic_trans_code: 'gu',
            reminderText: 'યાદ અપાવો'
        },
        Kannada: {
            key: 'Kannada',
            bcp_code: 'kn-IN',
            indic_trans_code: 'kn',
            reminderText: 'ನೆನಪಿಸಿ'
        },
        Urdu: {
            key: 'Urdu',
            bcp_code: 'ur-IN',
            indic_trans_code: 'ur',
            reminderText: 'یاد دہانی'
        },
        Nepali: {
            key: 'Nepali',
            bcp_code: 'ne-NP',
            indic_trans_code: 'ne',
            reminderText: 'स्मरण'
        },
        Sindhi: {
            key: 'Sindhi',
            bcp_code: 'sd-IN',
            indic_trans_code: 'sd',
            reminderText: 'ياد ڏياريندڙ'
        },
        Tamil: {
            key: 'Tamil',
            bcp_code: 'ta-IN',
            indic_trans_code: 'ta',
            reminderText: 'நினைவூட்டல்'
        },
        Telugu: {
            key: 'Telugu',
            bcp_code: 'te-IN',
            indic_trans_code: 'te',
            reminderText: 'గుర్తుచేయు'
        },
        Konkani: {
            key: 'Konkani',
            bcp_code: 'gom-IN',
            indic_trans_code: 'gom',
            reminderText: 'याद कर'
        },
        Punjabi: {
            key: 'Punjabi',
            bcp_code: 'pa-IN',
            indic_trans_code: 'pa',
            reminderText: 'ਯਾਦ ਕਰਾਓ'
        },
        Bodo: {
            key: 'Bodo',
            bcp_code: 'brx-IN',
            indic_trans_code: 'brx',
            reminderText: 'गोसो हो'
        },
        Bengali: {
            key: 'Bengali',
            bcp_code: 'bn-IN',
            indic_trans_code: 'bn',
            reminderText: 'স্মারক'
        },
        Marathi: {
            key: 'Marathi',
            bcp_code: 'mr-IN',
            indic_trans_code: 'mr',
            reminderText: 'आठवण'
        },
        Maithili: {
            key: 'Maithili',
            bcp_code: 'mai-IN',
            indic_trans_code: 'mai',
            reminderText: 'याद दिलाउ'
        },
        Malayalam: {
            key: 'Malayalam',
            bcp_code: 'ml-IN',
            indic_trans_code: 'ml',
            reminderText: 'ഓർമ്മിപ്പിക്കുക'
        },
        Assamese: {
            key: 'Assamese',
            bcp_code: 'as-IN',
            indic_trans_code: 'as',
            reminderText: 'সোঁৱৰাই দিয়ক'
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
