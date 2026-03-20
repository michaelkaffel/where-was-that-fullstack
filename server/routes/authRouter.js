import express from 'express';
import crypto from 'crypto';
import User from '../models/user.js';
import { corsWithOptions } from './cors.js';
import { sendPasswordResetEmail, sendUsernameRecoveryEmail } from '../utils/emailService.js';

const router = express.Router();

router.options('/forgot-password', corsWithOptions);
router.options('/reset-password/:token', corsWithOptions);
router.options('/recover-username', corsWithOptions);


router.post('/forgot-password', corsWithOptions, async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+hash');

        if (!user) {
            return res.status(200).json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        if (user.googleId && !user.hash) {
            return res.status(200).json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await sendPasswordResetEmail(user.email, user.username, resetUrl);

        res.status(200).json({
            message: 'If an account with that email exists, a password reset link has been sent'
        });
    } catch (err) {
        next(err);
    }
});



router.post('/reset-password/:token', corsWithOptions, async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const hashedToken = crypto.createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({
                message: 'Reset token is invalid or has expired'
            });
        }

        await user.setPassword(password);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            message: 'Password has been reset successfully. You can now log in.'
        });
    } catch (err) {
        next(err);
    }  
});



router.post('/recover-username', corsWithOptions, async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(200).json({
                message: 'If an account with that email exists, your username has been sent.'
            });
        }

        await sendUsernameRecoveryEmail(user.email, user.username);

        res.status(200).json({
            message: 'If an account with that email exists, your username has been sent.'
        });
    } catch (err) {
        next(err);
    }
});

export default router;