/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
process.env['NODE_ENV'] = 'production';

const Guardian = require('../models/guardian');
const Class = require('../models/class');
const Student = require('../models/student');
const Notice = require('../models/notice');
const Result = require('../models/result');
const AdminTeacher = require('../models/adminTeachers');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const {
    deleteGuardian,
    defaultActiveGuardiansOnly,
    studentIdToStudent,
    validateGuardianIndentityNumber
} = require('../controllers/guardian');
const {
    preFillNoticeDefaultFields,
    createdByGuard,
    createdByGuardView
} = require('../controllers/notice');
const { preFillResultDefaultFields } = require('../controllers/result');
const { ADMIN_AUTH_SESSION_EXPIRY_HOURS } = require('../config/constants');
const { defaultCurrentBatchClassesOnly } = require('../controllers/class');
const { defaultActiveStudentsOnly } = require('../controllers/student');
const Question = require('../models/question');
const {
    getQuestionForTeacher,
    answerQuestionForTeacher
} = require('../controllers/question');

const getAdminRouter = async () => {
    const AdminJS = (await import('adminjs')).default;
    const AdminJSExpress = (await import('@adminjs/express')).default;
    const AdminJSMongoose = await import('@adminjs/mongoose');
    const { files } = await import('../admin/uploadImage.mjs');
    const { componentLoader, Components } = await import(
        '../admin/component-loader.mjs'
    );
    const { handlerWrapper, beforeHookWrapper } = await import(
        '../admin/handlerWrapper.mjs'
    );

    AdminJS.registerAdapter({
        Resource: AdminJSMongoose.Resource,
        Database: AdminJSMongoose.Database
    });

    const admin = new AdminJS({
        rootPath: '/admin',
        resources: [
            {
                resource: Guardian,
                options: {
                    properties: {
                        indentityType: {
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        indentityNumber: {
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        address: {
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'address.createdAt': {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        'address.updatedAt': {
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
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
                        },
                        studentId: {
                            type: 'reference',
                            reference: 'Student',
                            isVisible: {
                                edit: false,
                                filter: true,
                                show: false,
                                list: false
                            }
                        }
                    },
                    actions: {
                        new: {
                            before: [
                                beforeHookWrapper(
                                    validateGuardianIndentityNumber
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
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            },
                            properties: {
                                startTime: {
                                    type: 'time'
                                },
                                endTime: {
                                    type: 'time'
                                }
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
                        address: {
                            isVisible: {
                                edit: true,
                                filter: false,
                                show: true,
                                list: false
                            }
                        },
                        'address.createdAt': {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
                        },
                        'address.updatedAt': {
                            isVisible: {
                                edit: false,
                                list: false,
                                filter: true,
                                show: true
                            }
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
                resource: Notice,
                options: {
                    properties: {
                        description: {
                            type: 'richtext'
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
                            },
                            properties: {
                                acknowledged: {
                                    isVisible: {
                                        edit: false,
                                        filter: true,
                                        show: true,
                                        list: false
                                    }
                                },
                                acknowledgedBy: {
                                    isVisible: {
                                        edit: false,
                                        filter: false,
                                        show: true,
                                        list: false
                                    }
                                }
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
                            before: [beforeHookWrapper(createdByGuard)]
                        },
                        list: {
                            before: [beforeHookWrapper(createdByGuardView)]
                        },
                        search: {
                            before: [beforeHookWrapper(createdByGuardView)]
                        },
                        delete: { efore: [beforeHookWrapper(createdByGuard)] },
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
                            isVisible: {
                                edit: true,
                                filter: true,
                                show: true,
                                list: false
                            }
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
                            before: [beforeHookWrapper(createdByGuard)]
                        }
                    }
                }
            },
            {
                resource: Question,
                options: {
                    properties: {
                        question: {
                            type: 'textarea'
                        },
                        'answers.text': {
                            type: 'textarea'
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
                            actionType: 'record',
                            component: Components.Answer,
                            handler: handlerWrapper(answerQuestionForTeacher)
                        }
                    }
                }
            },
            files
        ],
        componentLoader,
        branding: {
            companyName: 'School Desk',
            softwareBrothers: false
            // logo:
            //     'https://high-on-wheels-public.s3.ap-south-1.amazonaws.com/logo/logo.png' // OR false to hide the default one
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
            store: MongoStore.create({
                client: mongoose.connection.client,
                dbName: 'school-desk-session',
                ttl: ADMIN_AUTH_SESSION_EXPIRY_HOURS
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
