const { Op } = require('sequelize');
const {
    TARGET_AUDIENCE_TYPES,
    SUPPORTED_LANGUAGES,
    NOTICE_TYPES
} = require('../config/constants');
const Guardian = require('../models/guardian');
const Notice = require('../models/notice');
const Result = require('../models/result');
const Student = require('../models/student');
const { sendNotification } = require('./firebaseHelper');
const { sendMsg } = require('./smsHelper');
const { translate } = require('./translationHelper');

exports.processNotice = async (value, isReminder) => {
    const notice = await Notice.findByPk(value);

    switch (notice.targets.audienceType) {
        case TARGET_AUDIENCE_TYPES.STUDENT:
            await processStudent(
                notice,
                await Student.findByPk(notice.targets.student),
                isReminder
            );
            break;
        case TARGET_AUDIENCE_TYPES.GROUP_OF_STUDENTS:
            for (const student of notice.targets.students) {
                await processStudent(
                    notice,
                    await Student.findByPk(student),
                    isReminder
                );
            }
            break;
        case TARGET_AUDIENCE_TYPES.CLASS:
            await processClass(notice, notice.targets.class, isReminder);
            break;
        case TARGET_AUDIENCE_TYPES.ALL:
            await processAll(notice, isReminder);
            break;
        default:
            console.error(
                'Invalid Audience Type:',
                notice.targets.audienceType
            );
    }
    if (!isReminder) notice.published = true;
    await notice.save();
};

const processStudent = async (notice, student, isReminder) => {
    if (!student) return;
    const guardian = await Guardian.findOne({
        where: {
            students: {
                [Op.contains]: [student._id]
            }
        }
    });
    const message = await getMessage(notice, guardian, isReminder);
    if (guardian.notificationSettings.sms) {
        await sendMsg(
            guardian.phone,
            `${message.title}\n${message.description}`
        );
    }
    if (guardian.notificationSettings.pushToken) {
        await sendNotification(
            guardian.notificationSettings.pushToken,
            message.title,
            message.description
        );
    }
};

const processClass = async (notice, classId, isReminder) => {
    const students = await Student.findAll({
        where: { currentClass: classId }
    });
    for (const student of students) {
        await processStudent(notice, student, isReminder);
    }
};

const processAll = async (notice, isReminder) => {
    const students = await Student.findAll();
    for (const student of students) {
        await processStudent(notice, student, isReminder);
    }
};

const getMessage = async (notice, guardian, isReminder) => {
    let title, description;
    if (notice.translationsCache[guardian.preferredLanguage]) {
        title = notice.translationsCache[guardian.preferredLanguage].title;
        description =
            notice.translationsCache[guardian.preferredLanguage].description;
    } else {
        title = await translate(
            notice.title,
            SUPPORTED_LANGUAGES.English.key,
            guardian.preferredLanguage
        );
        description = await translate(
            notice.description,
            SUPPORTED_LANGUAGES.English.key,
            guardian.preferredLanguage
        );
        notice.translationsCache[guardian.preferredLanguage] = {
            title,
            description
        };
    }

    if (isReminder)
        title = `${
            SUPPORTED_LANGUAGES[guardian.preferredLanguage].reminderText
        }: ${title}`;
    return { title, description };
};

exports.processResult = async (value) => {
    const result = await Result.findByPk(value);
    const resultRows = result.entries.map(
        (r) => `Obtained ${r.marks} out of ${r.totalMarks} in ${r.subject}`
    );
    const percentage = calculatePercentage(result.entries);
    const title = result.rank
        ? `Achived rank ${result.rank} in exam ${result.examName}`
        : `Result of exam ${result.examName}`;
    const subjectScores = resultRows.join('\n');
    const notice = {
        title,
        description: `Percentage: ${percentage}%\n${subjectScores}`,
        noticeType: NOTICE_TYPES.INFO,
        publishedOn: result.publishOn,
        targets: {
            audienceType: TARGET_AUDIENCE_TYPES.STUDENT,
            student: result.student
        },
        createdBy: result.createdBy
    };
    await this.processNotice(await Notice.save(notice), false);
};

const calculatePercentage = (resultRows) => {
    if (!resultRows || resultRows.length === 0) return 0;

    const totalObtained = resultRows.reduce((sum, row) => sum + row.marks, 0);
    const totalMaxMarks = resultRows.reduce(
        (sum, row) => sum + row.totalMarks,
        0
    );

    return totalMaxMarks > 0 ? (totalObtained / totalMaxMarks) * 100 : 0;
};

exports.processQueryResponse = async (value) => {
    const data = JSON.parse(value);
    const students = await Student.findAll({where : { _id: { [Op.in]: data.studentIds });
    for (const student of students)
        await sendResponse(student, data.title, data.description);
};

const sendResponse = async (student, title, description) => {
    const guardians = await Guardian.findAll({
        where: {
            students: {
                [Op.contains]: [student._id]
            }
        }
    });
    await Promise.all(guardians.map(guardian=>{
        const finalTitle = await translate(
            title,
            SUPPORTED_LANGUAGES.English.key,
            guardian.preferredLanguage
        );
        const finalDescription = await translate(
            description,
            SUPPORTED_LANGUAGES.English.key,
            guardian.preferredLanguage
        );
        if (guardian.notificationSettings.sms) {
            await sendMsg(guardian.phone, `${finalTitle}\n${finalDescription}`);
        }
        if (guardian.notificationSettings.pushToken) {
            await sendNotification(
                guardian.notificationSettings.pushToken,
                finalTitle,
                finalDescription
            );
        }
    }))
};
