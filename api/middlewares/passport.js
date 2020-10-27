if (process.env.NODE_ENV !== "production") require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            User.findOne({ email: jwtPayload.email })
                .then((user) => {
                    if (user) return done(null, user);
                    return done(null, false);
                })
                .catch((err) => console.log(err));
        })
    );
};