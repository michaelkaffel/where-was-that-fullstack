import express from 'express';
import User from '../models/user.js'
import passport from 'passport';
import { getToken } from '../authenticate.js';

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

router.post('/signup', (req, res,) => {
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.status(500).json({err: err})
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.status(200).json({success: true, status: 'Registration Successful'})
                });
            }
        }
    )
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = getToken({_id: req.user._id});
    res.status(200).json({success: true, token: token, status: 'You are successfully loggen in!'})
});

router.get('/logout', (req, res, next) => {
    if (req.session && req.ression.user) {
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('session-id')
            res.redirect('/');
        });
    } else {
        const err = new Error('You are not logged in');
        err.status = 401;
        return next(err);
    }
});

export default router;
