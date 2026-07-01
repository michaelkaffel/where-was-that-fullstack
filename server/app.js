import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import createError from 'http-errors';
import express from 'express';
import path from 'path';
// import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import { corsMiddleware } from './routes/cors.js'
import { fileURLToPath } from 'url';
import { responseHelper } from './middleware.js';

import indexRouter from './routes/index.js';
import authRouter from './routes/authRouter.js'
import usersRouter from './routes/users.js';
import placeRouter from './routes/placeRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup only for dev
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        return next();
    }
    express.json()(req, res, next);
});

app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        return next();
    }
    express.urlencoded({ extended: false })(req, res, next);
});

app.use((req, res, next) => {
    if (!req.query && req.url.includes('?')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        req.query = Object.fromEntries(url.searchParams.entries());
    }
    next();
})

app.use(responseHelper);

app.use(corsMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/places', placeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler for developement
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });


// error handler for production
app.use(function (err, req, res, _next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    const status = err.status || 500;

    // Log every error that reaches this handler — server errors get full detail,
    // client errors (4xx) get a lighter log since they're expected/routine
    if (status >= 500) {
        console.error('[unhandled error]', {
            message: err.message,
            stack: err.stack,
            name: err.name,
            method: req.method,
            url: req.originalUrl,
            status,
            userId: req.user?._id?.toString(),
        });
    } else {
        console.warn('[client error]', {
            message: err.message,
            method: req.method,
            url: req.originalUrl,
            status,
        });
    }

    res.status(status).json({
        message: err.message || 'Internal server error'
    });
});

export default app;
