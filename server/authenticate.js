import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken'
import GoogleStrategy from 'passport-google-oauth20';

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: 3600 });
};

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('JWT payload:', jwt_payload);

        User.findById(jwt_payload._id)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }).catch((err) => done(err, false));
    })
);

export const googlePassport = passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/users/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const email = profile.emails?.[0]?.value;

                let user = await User.findOne({
                    $or: [
                        { googleId: profile.id },
                        { email: email }
                    ]
                });

                if (!user) {
                    user = await User.create({
                        username: profile.displayName,
                        googleId: profile.id,
                        firstname: profile.name?.givenName || '',
                        lastname: profile.name?.familyName || '',
                        email: email
                    })
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

export const verifyUser = passport.authenticate('jwt', { session: false });

export const verifyAdmin = (req, res, next) => {
    if (!req.user.admin) {
        return res.status(403).json({
            message: 'Admin access required'
        });
    }
    next();
};

export default passport;