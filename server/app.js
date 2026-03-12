import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import createError from 'http-errors';
import express, { response } from 'express';
import path from 'path';
// import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import { corsMiddleware } from './routes/cors.js'
import { fileURLToPath } from 'url';
import { responseHelper } from './middleware.js';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import placeRouter from './routes/placeRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let url = process.env.MONGO_ATLAS

const connect = mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
});

connect.then(() => {
    console.log('Connected correctly to server');
    console.log(`MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
},
    err => console.log(err)
);

mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
})




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
app.use(function (err, req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Internal server error'
    });
});

export default app;
