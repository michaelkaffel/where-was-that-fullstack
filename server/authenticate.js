import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import User from './models/user.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken'

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
    return jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 3600});
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

export const verifyUser = passport.authenticate('jwt', { session: false });

export default passport;