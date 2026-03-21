import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.EMAIL_FROM || 'Where Was That <noreply@where-was-that.com>';

export const sendPasswordResetEmail = async (email, username, resetUrl) => {
    const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: 'Where Was That — Password Reset',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hi ${username},</p>
                <p>We received a request to reset your password. Click the link below to set a new password:</p>
                <p>
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #4a7c59; color: white; text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </p>
                <p>This link will expire in <strong>1 hour</strong>.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
        `
    });

    if (error) {
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }

    return data;
};

export const sendUsernameRecoveryEmail = async (email, username) => {
    const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: 'Where Was That — Username Recovery',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Username Recovery</h2>
                <p>Hi there,</p>
                <p>You requested your username for the account associated with this email address.</p>
                <p>Your username is: <strong>${username}</strong></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
            </div>
        `
    });

    if (error) {
        throw new Error(`Failed to send username recovery email: ${error.message}`);
    }

    return data;
};