const { CustomError } = require('../helpers/errorHelper');

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
