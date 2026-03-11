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

        res.api(users)

    } catch (err) {
        next(err);
    }
});

router.options('/login', corsWithOptions);
router.options('/signup', corsWithOptions);
router.options('/me', corsWithOptions);

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
            status: 'Registration Successful, you are now logged in!',
            user: registeredUser
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', corsWithOptions, passport.authenticate('local', { session: false }), (req, res, next) => {

    try {
        const token = getToken({ _id: req.user._id });
        res.status(200).json({
            success: true,
            token: token,
            status: 'You are successfully logged in!',
            user: req.user
        })
    } catch (err) {
        next(err);
    }
    
});

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = getToken({ _id: req.user._id });

        const redirectUrl = `${process.env.CLIENT_URL}/oauth-success?token=${token}`;

        res.redirect(redirectUrl);
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

        res.api(user);
    } catch (err) {
        next(err);
    }
});

router.patch('/me', corsWithOptions, verifyUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+hash +salt');

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        if (req.body.newPassword) {
            if (!user.hash) {
                return res.status(400).json({ message: 'Password change not available for google accounts'})
            }
            if (!req.body.currentPassword) {
                return res.status(400).json({ message: 'Current password is required'})
            }

            try {
                await user.changePassword(req.body.currentPassword, req.body.newPassword);
            } catch (err) {
                return res.status(401).json({ message: 'Current password is incorrect'})
            }
        }
        
        const allowedFields = ['username', 'firstname', 'lastname', 'email'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.api(user);
    } catch (err) {
        next(err);
    }
});

router.delete('/me', corsWithOptions, verifyUser, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }

        await user.deleteOne();

        res.status(200).json({ message: 'Account deleted' });
    } catch (err) {
        next(err);
    }
})

router.get('/logout', corsWithOptions, verifyUser, (req, res) => {
    res.status(200).json({
        success: true,
        status: 'JWT logout handles client-side'
    })
});

router.get('/:userId', corsWithOptions, verifyUser, async (req, res, next) => {

    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            const err = new Error('User not found');
            err.status = 404;
            return next(err);
        }


        res.api(user);


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



export default router;
