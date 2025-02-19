const { Types } = require('mongoose');
exports.checkIfObjectId = (id) => {
    try {
        new Types.ObjectId(id);
        return (
            Types.ObjectId.isValid(id) &&
            String(id) == String(new Types.ObjectId(id))
        );
    } catch (e) {
        return false;
    }
};
