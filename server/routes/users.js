import express from 'express';
import User from '../models/user.js'
import passport from 'passport';
import { corsWithOptions } from './cors.js';
import { getToken } from '../authenticate.js';
import { verifyUser, verifyAdmin } from '../authenticate.js';


const router = express.Router();

/* GET users listing. */
router.get('/', corsWithOptions, verifyUser, verifyAdmin, async (req, res, next) => {
    try {
        const users = await User.find()
            .select('username firstname lastname admin');

        res.status(200).json(users)

    } catch (err) {
        next(err);
    }
});

router.post('/signup', corsWithOptions, async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        });

        const registeredUser = await User.register(user, req.body.password);

        const token = getToken({ _id: registeredUser._id });

        res.status(201).json({
            success: true,
            token: token,
            status: 'Registration Successful, you are now loggen in!',
            user: registeredUser.toObject()
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', corsWithOptions, passport.authenticate('local', { session: false }), (req, res) => {
    const token = getToken({ _id: req.user._id });
    res.status(200).json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
        user: req.user.toObject()
    })
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = getToken({ _id: req.user._id });

        const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;

        res.redirect(redirectUrl);

        // res.status(200).setHeader('Content-Type', 'application/json').json({
        //     success: true,
        //     token: token,
        //     user: req.user.toObject()
        // });
    }
);

router.get('/me', corsWithOptions, verifyUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        res.status(200).json(user.toObject());
    } catch (err) {
        next(err);
    }
});

router.get('/:userId', corsWithOptions, verifyUser, async (req, res, next) => {

    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        if (user) {
            res.status(200).json(user)
        }

    } catch (err) {
        next(err);
    }
    
    
});

router.delete('/:userId', corsWithOptions, verifyUser, verifyAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        await user.deleteOne();

        res.status(200).json({ message: 'User and associated data deleted' })
    } catch (err) {
        next(err);
    }
});

router.get('/logout', corsWithOptions, verifyUser, (req, res) => {
    res.status(200).json({
        success: true,
        status: 'JWT logout handles client-side'
    })
});

export default router;
