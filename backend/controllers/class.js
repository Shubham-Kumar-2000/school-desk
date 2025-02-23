const { CustomError } = require('../helpers/errorHelper');
const AdminTeacher = require('../models/adminTeachers');
const Class = require('../models/class');

exports.defaultCurrentBatchClassesOnly = (request) => {
    const { query = {} } = request;
    // let currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth() + 1;

    // if (currentMonth < Number(process.env.ACADEMIC_YEAR_START_MONTH)) {
    //     currentYear = currentYear - 1;
    // }

    // if (!query['filters.batch']) {
    //     query['filters.batch'] = currentYear;
    // }

    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};

exports.fetchClass = async (classId) => {
    let cls = await Class.findByPk(classId, {
        include: [{ model: AdminTeacher, as: 'classTeacher' }] // Assuming AdminTeacher is the class teacher model
    });

    if (!cls) {
        throw new CustomError('Class not found.');
    }
    cls = cls.get({ plain: true });

    const teachers = await Promise.all(
        cls.schedule.map((s) => AdminTeacher.findByPk(s.teacher))
    ).then((ts) =>
        ts.reduce((acc, t) => {
            if (!t) return acc;
            acc[t._id] = t.get({ plain: true });
            return acc;
        }, {})
    );

    cls.schedule.forEach((s) => {
        s.teacher = teachers[s.teacher] || {
            name: 'Unknown'
        };
    });
    return cls;
};
