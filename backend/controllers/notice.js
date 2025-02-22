const {
    TARGET_AUDIENCE_TYPES,
    NOTIF_PAGINATION_LIMIT,
    SUPPORTED_LANGUAGES
} = require('../config/constants');
const { CustomError } = require('../helpers/errorHelper');
const Notice = require('../models/notice');
const { translate } = require('../helpers/translationHelper');
const { Op } = require('sequelize');
const AdminTeacher = require('../models/adminTeachers');

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

const getMyNoticeFilter = (studentId, classId) => {
    return {
        where: {
            '$targets.audienceType$': TARGET_AUDIENCE_TYPES.STUDENT,
            '$targets.studentId$': studentId // Use the foreign key name
        },
        order: [['publishOn', 'DESC']]
    };
};

exports.fetchRecentNotices = async (studentId, classId) => {
    const filter = getMyNoticeFilter(studentId, classId);
    filter.limit = 5;
    filter.include = [{ model: AdminTeacher, as: 'createdByData' }];

    const notices = await Notice.findAll(filter);
    return notices;
};

exports.fetchRecentNoticeId = async (noticeId) => {
    return Notice.findByPk(noticeId);
};

exports.getMyNotifications = async (req, res, next) => {
    try {
        const student = req.student;
        const skip = Math.max(
            NOTIF_PAGINATION_LIMIT * (Number(req.query.page) - 1),
            0
        );

        const filter = getMyNoticeFilter(student._id, student.currentClass);
        filter.where.published = true;

        if (req.query.noticeType) {
            filter.where.noticeType = req.query.noticeType;
        }

        filter.offset = skip;
        filter.limit = NOTIF_PAGINATION_LIMIT + 1;
        filter.include = [{ model: AdminTeacher, as: 'createdByData' }];

        const notices = await Notice.findAll(filter);

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

        const filter = getMyNoticeFilter(student._id, student.currentClass);
        // published: true,
        // 'targets.acknowdegementRequired': true,
        // _id: new mongoose.Types.ObjectId(req.params.id)
        // };

        filter.where.published = true;
        filter.where['$targets.acknowledgementRequired$'] = true;
        filter.where._id = req.params.id;

        delete filter.order;

        const notice = await Notice.findOne(filter);

        if (!notice) {
            throw new CustomError('Invalid Notice ID', 404);
        }

        if (!notice.targets.acknowledgedBy.includes(student._id)) {
            notice.targets.acknowledgedBy.push(student._id);
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
