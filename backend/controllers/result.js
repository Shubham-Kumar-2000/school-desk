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
