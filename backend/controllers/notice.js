const { default: mongoose } = require('mongoose');
const {
    TARGET_AUDIENCE_TYPES,
    NOTIF_PAGINATION_LIMIT,
    SUPPORTED_LANGUAGES
} = require('../config/constants');
const { CustomError } = require('../helpers/errorHelper');
const Notice = require('../models/notice');
const { translate } = require('../helpers/translationHelper');

exports.preFillNoticeDefaultFields = (request, context) => {
    const { payload = {} } = request;
    payload.createdBy = context.currentAdmin._id;
    payload.published = false;

    if (new Date(payload.publishOn) < new Date()) {
        payload.publishOn = new Date();
    }

    const newPayload = {
        ...payload
    };

    request.payload = newPayload;

    return request;
};

exports.createdByGuardView = (request, context) => {
    const { query = {} } = request;
    query['filters.createdBy'] = context.currentAdmin._id;

    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};

exports.createdByGuard = (request, context) => {
    if (
        context.record &&
        String(context.record.createdBy) !== String(context.currentAdmin._id)
    ) {
        throw new CustomError('Unauthorized', 401);
    }
};

const translateNotices = (notices, language) => {
    return notices.map(async (notice) => {
        if (notice.translationsCache[language]) {
            notice.title = notice.translationsCache[language].title;
            notice.description = notice.translationsCache[language].description;
            return notice;
        }

        notice.title = await translate(
            notice.title,
            SUPPORTED_LANGUAGES.English.key,
            language
        );
        notice.description = await translate(
            notice.description,
            SUPPORTED_LANGUAGES.English.key,
            language
        );

        return notice;
    });
};

exports.fetchRecentNotices = async (studentId, classId) => {
    const filter = {
        $or: [
            {
                'targets.audienceType': TARGET_AUDIENCE_TYPES.ALL
            },
            {
                'targets.audienceType': TARGET_AUDIENCE_TYPES.STUDENT,
                'targets.student': new mongoose.Types.ObjectId(studentId)
            },
            {
                'targets.audienceType': TARGET_AUDIENCE_TYPES.GROUP_OF_STUDENTS,
                'targets.students': new mongoose.Types.ObjectId(studentId)
            },
            {
                'targets.audienceType': TARGET_AUDIENCE_TYPES.CLASS,
                'targets.class': new mongoose.Types.ObjectId(classId)
            }
        ]
    };

    const notices = await Notice.find(filter)
        .sort({ publishOn: -1 })
        .limit(5)
        .populate('createdBy');
    return notices;
};

exports.fetchRecentNoticeId = async (noticeId) => {
    return Notice.findById(noticeId);
};

exports.getMyNotifications = async (req, res, next) => {
    try {
        const student = req.student;
        const skip = Math.max(
            NOTIF_PAGINATION_LIMIT * (Number(req.query.page) - 1),
            0
        );

        const filter = {
            $or: [
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.ALL
                },
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.STUDENT,
                    'targets.student': new mongoose.Types.ObjectId(student._id)
                },
                {
                    'targets.audienceType':
                        TARGET_AUDIENCE_TYPES.GROUP_OF_STUDENTS,
                    'targets.students': new mongoose.Types.ObjectId(student._id)
                },
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.CLASS,
                    'targets.class': student.currentClass
                }
            ],
            published: true
        };

        if (req.query.noticeType) {
            filter.noticeType = req.query.noticeType;
        }

        const notices = await Notice.find(filter)
            .sort({ publishOn: -1 })
            .skip(skip)
            .limit(NOTIF_PAGINATION_LIMIT + 1)
            .populate('createdBy')
            .populate('resultAttached');

        res.status(200).json({
            err: false,
            notices: await Promise.all(
                translateNotices(
                    notices.slice(0, NOTIF_PAGINATION_LIMIT),
                    req.guardian.preferredLanguage
                )
            ),
            hasNext: notices.length > NOTIF_PAGINATION_LIMIT
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.acknowledgeNotice = async (req, res, next) => {
    try {
        const student = req.student;

        const filter = {
            $or: [
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.ALL
                },
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.STUDENT,
                    'targets.student': new mongoose.Types.ObjectId(student._id)
                },
                {
                    'targets.audienceType':
                        TARGET_AUDIENCE_TYPES.GROUP_OF_STUDENTS,
                    'targets.students': new mongoose.Types.ObjectId(student._id)
                },
                {
                    'targets.audienceType': TARGET_AUDIENCE_TYPES.CLASS,
                    'targets.class': student.currentClass
                }
            ],
            published: true,
            'targets.acknowdegementRequired': true,
            _id: new mongoose.Types.ObjectId(req.params.id)
        };

        const notice = await Notice.findOneAndUpdate(
            filter,
            {
                $addToSet: {
                    'targets.acknowledgedBy': new mongoose.Types.ObjectId(
                        student._id
                    )
                }
            },
            { new: true }
        );

        if (!notice) {
            throw new CustomError('Invalid Notice ID', 404);
        }

        if (
            (notice.targets.acknowledgedBy.length ===
                notice.targets.students.length &&
                notice.targets.audienceType ==
                    TARGET_AUDIENCE_TYPES.GROUP_OF_STUDENTS) ||
            notice.targets.audienceType == TARGET_AUDIENCE_TYPES.STUDENT
        ) {
            notice.targets.acknowledged = true;
            await notice.save();
        }

        res.status(200).json({
            err: false
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
};
