const Result = require('../models/result');

exports.preFillResultDefaultFields = (request, context) => {
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

exports.fetchRecentResults = (studentId) => {
    return Result.find({ student: studentId }).sort({ createdAt: -1 }).limit(5);
};
