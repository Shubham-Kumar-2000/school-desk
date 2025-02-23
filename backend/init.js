require('dotenv').config({ path: '.env' });
const { CustomError } = require('./helpers/errorHelper');
const db = require('./models/init');

const args = process.argv.slice(2); // Get command-line arguments (excluding node and script name)

if (args.length !== 3) {
    throw new CustomError(
        "'Usage: npm run initBackend <name> <email> <password>'"
    );
}

const AdminTeacher = require('./models/adminTeachers');
require('./models/class');
require('./models/guardian');
require('./models/image');
require('./models/notice');
require('./models/otp');
require('./models/otpUsage');
require('./models/question');
require('./models/result');
require('./models/student');

const name = args[0];
const email = args[1];
const password = args[2];

const initBackend = async () => {
    await db.sync({ alter: true });
    await AdminTeacher.create({
        name,
        email,
        password
    });
    console.log('Backend Initiated');
    // eslint-disable-next-line no-process-exit
    process.exit(0);
};

initBackend();
