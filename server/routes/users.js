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
            .select('_id username firstname lastname admin');

        res.status(200).json(users)

    } catch (err) {
        next(err);
    }
});

router.post('/signup', corsWithOptions,  async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        const registeredUser = await User.register(user, req.body.password);

        const token = getToken({ _id: registeredUser._id });

        res.status(201).json({
            success: true,
            token: token,
            status: 'Registration Successful, you are now loggen in!',
            user: {
                _id: registeredUser._id,
                username: registeredUser.username,
                firstname: registeredUser.firstname,
                lastname: registeredUser.lastname
            }
        })
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

router.post('/login', corsWithOptions,  passport.authenticate('local', { session: false }), (req, res) => {
    const token = getToken({ _id: req.user._id });
    res.status(200).json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
        user: {
            _id: req.user._id,
            username: req.user.username,
            firstname: req.user.firstname,
            lastname: req.user.lastname
        }
    })
});

router.delete('/:userId', corsWithOptions,  verifyUser, verifyAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        await user.deleteOne();

        res.status(200).json({ message: 'User and associated data deleted'})
    } catch (err) {
        next(err);
    }
})

router.get('/logout', corsWithOptions,  (req, res) => {
    res.status(200).json({
        success: true,
        status: 'JWT logout handles client-side'
    })
});

export default router;
