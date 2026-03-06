import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
import authenticate from './authenticate.js'
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import placeRouter from './routes/placeRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let url; 

if (process.env.NODE_END === 'development') {
    url = process.env.MONGO_ATLAS
    
} else {
    url = process.env.MONGO_HOTSPOT
    
}

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

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    } else {
        console.log(`Redirecting to https://${req.hostname}:${app.get('secPort')}${req.url}`);
        res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(process.cwd(), 'public/images')))

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/places', placeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
