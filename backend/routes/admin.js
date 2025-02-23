/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
process.env['NODE_ENV'] = 'production';
require('../models/image');
const session = require('express-session');
const connectPgSimple = require('connect-pg-simple');
const PgStore = connectPgSimple(session);

const Class = require('../models/class');
const AdminTeacher = require('../models/adminTeachers');

const {
    ADMIN_AUTH_SESSION_EXPIRY_HOURS,
    DAYS_OF_WEEK,
    TARGET_AUDIENCE_TYPES
} = require('../config/constants');
const { defaultCurrentBatchClassesOnly } = require('../controllers/class');
const { defaultActiveStudentsOnly } = require('../controllers/student');
const Student = require('../models/student');
const { addressAdminJsSchema } = require('../models/address');
const {
    defaultActiveGuardiansOnly,
    studentIdToStudent,
    deleteGuardian,
    validateGuardianIdentityNumber
} = require('../controllers/guardian');
const { isArray } = require('lodash');
const Guardian = require('../models/guardian');
const Notice = require('../models/notice');
const {
    preFillNoticeDefaultFields,
    createdByGuard,
    createdByGuardView
} = require('../controllers/notice');
const Result = require('../models/result');
const { preFillResultDefaultFields } = require('../controllers/result');
const Question = require('../models/question');
const {
    getQuestionForTeacher,
    answerQuestionForTeacher
} = require('../controllers/question');
const { types } = require('pg');

const getAdminRouter = async () => {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;
    const AdminJSSequelize = await import('@adminjs/sequelize');
    const { componentLoader, Components } = await import(
        '../admin/component-loader.mjs'
    );
    const { handlerWrapper, beforeHookWrapper } = await import(
        '../admin/handlerWrapper.mjs'
    );

    AdminJS.registerAdapter({
        Resource: AdminJSSequelize.Resource,
        Database: AdminJSSequelize.Database
    });

    const admin = new AdminJS({
        rootPath: '/admin',
        resources: [
            {
                resource: AdminTeacher,
                options: {
                    properties: {
                        password: {
                            isVisible: {
                                filter: false,
                                show: false,
                                edit: true,
                                list: false
                            }
                        },
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        }
                    },
                    actions: {
                        edit: { isVisible: false }
                    }
                }
            },
            {
                resource: Class,
                options: {
                    properties: {
                        schedule: {
                            type: 'mixed',
                            isArray: true,
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'schedule.day': {
                            type: 'string',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            },
                            availableValues: DAYS_OF_WEEK.map((day) => ({
                                value: day
                            }))
                        },
                        'schedule.subject': {
                            type: 'string',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'schedule.teacher': {
                            type: 'reference',
                            reference: 'admin_teachers',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'schedule.startTime': {
                            type: 'string',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'schedule.endTime': {
                            type: 'string',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        }
                    },
                    actions: {
                        bulkDelete: { isVisible: false },
                        delete: { isVisible: false },
                        list: {
                            before: [
                                beforeHookWrapper(
                                    defaultCurrentBatchClassesOnly
                                )
                            ]
                        },
                        search: {
                            before: [
                                beforeHookWrapper(
                                    defaultCurrentBatchClassesOnly
                                )
                            ]
                        }
                    }
                }
            },
            {
                resource: Student,
                options: {
                    properties: {
                        ...addressAdminJsSchema,
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        dob: {
                            type: 'date'
                        },
                        avatar: {
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        }
                    },
                    actions: {
                        bulkDelete: { isVisible: false },
                        delete: { isVisible: false },
                        list: {
                            before: [
                                beforeHookWrapper(defaultActiveStudentsOnly)
                            ]
                        },
                        search: {
                            before: [
                                beforeHookWrapper(defaultActiveStudentsOnly)
                            ]
                        }
                    }
                }
            },
            {
                resource: Guardian,
                options: {
                    properties: {
                        identityType: {
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        identityNumber: {
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        },
                        dob: {
                            type: 'date'
                        },
                        notificationSettings: {
                            isVisible: false
                        },
                        students: {
                            type: 'reference',
                            reference: 'Students',
                            isArray: true,
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        ...addressAdminJsSchema
                    },
                    actions: {
                        new: {
                            before: [
                                beforeHookWrapper(
                                    validateGuardianIdentityNumber
                                )
                            ]
                        },
                        delete: {
                            isVisible: true,
                            handler: handlerWrapper(deleteGuardian)
                        },
                        bulkDelete: { isVisible: false },
                        list: {
                            before: [
                                beforeHookWrapper(defaultActiveGuardiansOnly),
                                beforeHookWrapper(studentIdToStudent)
                            ]
                        },
                        search: {
                            before: [
                                beforeHookWrapper(defaultActiveGuardiansOnly),
                                beforeHookWrapper(studentIdToStudent)
                            ]
                        }
                    }
                }
            },
            {
                resource: Notice,
                options: {
                    properties: {
                        description: {
                            type: 'textarea',
                            props: {
                                rows: 10
                            }
                        },
                        createdBy: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        publishOn: {
                            type: 'datetime'
                        },
                        reminders: {
                            type: 'datetime',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        targets: {
                            type: 'mixed',
                            components: {
                                edit: Components.NoticeTargets,
                                new: Components.NoticeTargets,
                                show: Components.NoticeTargets
                            },
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'targets.audienceType': {
                            type: 'string',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            },
                            availableValues: Object.keys(
                                TARGET_AUDIENCE_TYPES
                            ).map((key) => ({
                                value: TARGET_AUDIENCE_TYPES[key]
                            }))
                        },
                        'targets.student': {
                            type: 'reference',
                            reference: 'Students',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'targets.students': {
                            type: 'reference',
                            reference: 'Students',
                            isArray: true,
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'targets.class': {
                            type: 'reference',
                            reference: 'Classes',
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'targets.acknowledgementRequired': {
                            type: 'boolean'
                        },
                        'targets.acknowledgedBy': {
                            type: 'reference',
                            reference: 'Students',
                            isArray: true,
                            isVisible: {
                                edit: false,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'targets.acknowledged': {
                            type: 'boolean',
                            isVisible: {
                                edit: false,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        published: {
                            isVisible: {
                                edit: false,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        resultAttached: {
                            isVisible: {
                                edit: false,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        translationsCache: {
                            isVisible: false
                        }
                    },
                    actions: {
                        new: {
                            before: [
                                beforeHookWrapper(preFillNoticeDefaultFields)
                            ]
                        },
                        edit: {
                            isVisible: (context) => {
                                const { record } = context;

                                return record?.params?.published == false;
                            },
                            before: [beforeHookWrapper(createdByGuard)]
                        },
                        list: {
                            before: [beforeHookWrapper(createdByGuardView)]
                        },
                        search: {
                            before: [beforeHookWrapper(createdByGuardView)]
                        },
                        delete: {
                            before: [beforeHookWrapper(createdByGuard)],
                            isVisible: (context) => {
                                const { record } = context;

                                return record?.params?.published == false;
                            }
                        },
                        bulkDelete: { isVisible: false }
                    }
                }
            },
            {
                resource: Result,
                options: {
                    properties: {
                        published: {
                            isVisible: {
                                edit: false,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        entries: {
                            type: 'mixed',
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            },
                            isArray: true
                        },
                        'entries.subject': {
                            type: 'string'
                        },
                        'entries.marks': {
                            type: 'number'
                        },
                        'entries.totalMarks': {
                            type: 'number'
                        },
                        createdBy: {
                            isVisible: {
                                edit: false,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        createdAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        },
                        updatedAt: {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: false,
                                show: true
                            }
                        }
                    },
                    actions: {
                        bulkDelete: { isVisible: false },
                        new: {
                            before: [
                                beforeHookWrapper(preFillResultDefaultFields)
                            ]
                        },
                        edit: {
                            isVisible: (context) => {
                                const { record } = context;

                                return record?.params?.published == false;
                            },
                            before: [beforeHookWrapper(createdByGuard)]
                        },
                        delete: {
                            before: [beforeHookWrapper(createdByGuard)],
                            isVisible: (context) => {
                                const { record } = context;

                                return record?.params?.published == false;
                            }
                        }
                    }
                }
            },
            {
                resource: Question,
                options: {
                    listProperties: ['question', 'askedBy', 'askedByStudent'],
                    properties: {
                        question: {
                            type: 'textarea'
                        },
                        answers: {
                            type: 'mixed',
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            },
                            isArray: true
                        },
                        'answers.text': {
                            type: 'textarea'
                        },
                        'answer.answeredByAi': {
                            type: 'boolean'
                        },
                        requiredHumanIntervention: {
                            isVisible: {
                                edit: false,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        humanAnswered: {
                            isVisible: {
                                edit: false,
                                filter: true,
                                show: true,
                                list: false
                            }
                        }
                    },
                    actions: {
                        bulkDelete: { isVisible: false },
                        new: { isVisible: false },
                        edit: { isVisible: false },
                        delete: { isVisible: false },
                        list: {
                            before: [beforeHookWrapper(getQuestionForTeacher)]
                        },
                        search: {
                            before: [beforeHookWrapper(getQuestionForTeacher)]
                        },
                        answer: {
                            isVisible: (context) => {
                                const { record } = context;

                                return (
                                    record?.params?.humanAnswered == false &&
                                    record?.params?.requiredHumanIntervention
                                );
                            },
                            actionType: 'record',
                            component: Components.Answer,
                            handler: handlerWrapper(answerQuestionForTeacher)
                        }
                    }
                }
            }
        ],
        componentLoader,
        branding: {
            companyName: 'School Desk',
            softwareBrothers: false,
            logo: 'https://cs-school-desk.s3.amazonaws.com/1/1.png' // OR false to hide the default one
        },
        locale: {
            translations: {
                messages: {
                    loginWelcome: 'Administration Panel - Login' // the smaller text
                },
                labels: {
                    loginWelcome: 'School Desk' // this could be your project name
                }
            }
        },
        assets: {
            styles: ['/styles/admin.css'] // here you can hide the default images and re-position the boxes or text.
        },
        dashboard: Components['Dashboard']
            ? {
                  component: Components.Dashboard
              }
            : undefined
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate: async (email, password) => {
                return await AdminTeacher.checkIfUserExists(email, password);
            },
            cookieName: 'schooldeskadmin',
            cookiePassword: process.env.SESSION_SECRET
        },
        null,
        {
            store: new PgStore({
                conString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:5432/${process.env.PG_DATABASE}`,
                ttl: ADMIN_AUTH_SESSION_EXPIRY_HOURS,
                createTableIfMissing: true
            }),
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
            cookie: {
                httpOnly: true,
                secure: false
            },
            name: 'schooldeskadmin'
        }
    );
    return adminRouter;
};
module.exports = getAdminRouter;
