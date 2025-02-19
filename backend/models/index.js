const mongoose = require('mongoose');
mongoose.Promise = Promise;
exports.connect = function () {
    const promise = new Promise((resolve, reject) =>
        mongoose
            .connect(process.env.MONGO_DB_URI, {})
            .then((res) => {
                console.log('Connected to MongoDB');
                resolve(res);
            })
            .catch((err) => {
                console.log(
                    'MongoDB connection error. Please make sure that MongoDB is running.'
                );
                console.log(err);
                reject(err);
            })
    );
    if (!process.env.cron) mongoose.set('debug', true);
    mongoose.connection.on('error', () => {
        console.log(
            'MongoDB connection error. Please make sure that MongoDB is running.'
        );
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    });
    return promise;
};
