const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./helpers/errorHelper');
const Mongoose = require('./models/index');
const tokenHelper = require('./helpers/tokenHelper');
const app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

const usersRouter = require('./routes/guardian');
const noticeRouter = require('./routes/notice');
const questionsRouter = require('./routes/question');
const getAdminRouter = require('./routes/admin');

const getApp = async () => {
    await Mongoose.connect();
    app.use('/admin', await getAdminRouter());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/users', usersRouter);
    app.use('/notice', tokenHelper.validate, noticeRouter);
    app.use('/questions', tokenHelper.validate, questionsRouter);

    app.use(function (req, res, next) {
        next(createError(404));
    });

    // error handler
    // eslint-disable-next-line no-unused-vars
    app.use(errorHandler);

    return app;
};
module.exports = getApp;
