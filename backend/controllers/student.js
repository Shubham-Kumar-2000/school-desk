const { USER_STATUS } = require('../config/constants');

exports.defaultActiveStudentsOnly = (request) => {
    const { query = {} } = request;
    if (!query['filters.status']) {
        query['filters.status'] = USER_STATUS.ACTIVE;
    }
    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};
