const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
    fetchRecentNotices,
    fetchRecentNoticeId
} = require('../controllers/notice');

const { fetchClass } = require('../controllers/class');
const { fetchRecentResults } = require('../controllers/result');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

if (!process.env.INSTITUTION_NAME) {
    throw new Error('INSTITUTION_NAME is not defined');
}

exports.askAi = async (question, student, guardian, noticeId) => {
    const recentNotices = await fetchRecentNotices(
        student._id,
        student.currentClass
    );

    const currentNotice = noticeId ? await fetchRecentNoticeId(noticeId) : null;
    const currentClass = await fetchClass(student.currentClass);
    const recentResults = await fetchRecentResults(student._id);

    const schedules = currentClass.schedule.reduce((acc, schedule) => {
        if (!acc[schedule.day]) {
            acc[schedule.day] = [];
        }
        acc[schedule.day].push(schedule);
        return acc;
    }, {});

    const prompt = `
    As a communication manager named Shaila of a school ${
        process.env.INSTITUTION_NAME
    } in India,
    Take the below context into consideration and generate a response for the following question:

    A guardian ${guardian.name} of a student ${
        student.name
    } who is studying in class ${currentClass?.name} ${
        currentClass?.batch
    } under class teacher ${
        currentClass?.classTeacher?.name
    } having below schedule :

    ${Object.keys(schedules)
        .map(
            (scheduleDay) =>
                'On ' +
                scheduleDay +
                ' : ' +
                schedules[scheduleDay]
                    .map(
                        (schedule) =>
                            schedule?.subject +
                            ' from ' +
                            schedule?.startTime +
                            ' with teacher ' +
                            schedule?.teacher?.name
                    )
                    .join(', ')
        )
        .join('\n')}
    
    ${recentNotices?.length > 0 ? 'Last few notifications: ' : ''}
    ${recentNotices
        .map((notice) => notice?.title + '\n' + notice?.description)
        .join('\n\n')}

    ${recentResults?.length > 0 ? 'Last few Results:' : ''}
    ${recentResults.map((result) => {
        return (
            'Result for exam ' +
            result?.examName +
            ' with rank ' +
            result?.rank +
            '\n' +
            result.entries.reduce((acc, entry) => {
                return (
                    acc +
                    entry?.subject +
                    ' : ' +
                    entry?.marks +
                    '/' +
                    entry?.totalMarks +
                    '\n'
                );
            }, '') +
            '\n\n'
        );
    })}${
        currentNotice
            ? '\n Current Notice : \n' +
              currentNotice?.title +
              '\n' +
              currentNotice?.description +
              '\n\n'
            : ''
    }Please answer the below question asked by the guardian in plain text no formatting
    If the question is not answerable just "I couldn't answer that.".
    Don't provide unnecessary details.
    `;
    console.log(prompt);

    const response = await model.generateContent([prompt, question]);
    return response.response.text();
};
