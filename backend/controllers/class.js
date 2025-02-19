exports.defaultCurrentBatchClassesOnly = (request) => {
    const { query = {} } = request;
    let currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (currentMonth < Number(process.env.ACADEMIC_YEAR_START_MONTH)) {
        currentYear = currentYear - 1;
    }

    const newQuery = {
        ...query,
        batch: currentYear
    };

    request.query = newQuery;

    return request;
};
