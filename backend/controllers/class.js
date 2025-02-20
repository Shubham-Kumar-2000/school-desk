exports.defaultCurrentBatchClassesOnly = (request) => {
    const { query = {} } = request;
    let currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth < Number(process.env.ACADEMIC_YEAR_START_MONTH)) {
        currentYear = currentYear - 1;
    }

    if (!query['filters.batch']) {
        query['filters.batch'] = currentYear;
    }

    const newQuery = {
        ...query
    };

    request.query = newQuery;

    return request;
};
