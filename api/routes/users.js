const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const validationMiddleware = require("../middlewares/validationMiddleware")

const User = require("../models/User");
/**
 * @route POST /api/users/register
 * @description Register a user account
 * @access public
 */
router.post("/register", validationMiddleware.register, (req, res) => {
    let { first_name, last_name, email, phone, password } = req.body;
    try {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({
                    message: "Something went wrong",
                    err
                })
            } else {
                let newUser = new User({
                    _id: mongoose.Types.ObjectId(),
                    first_name,
                    last_name,
                    email,
                    phone,
                    password: hash
                });
                newUser.save().then((user) => {
                    res.status(201).json({
                        user,
                        message: 'User was successfully created'
                    })
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
})

/**
 * @route POST /api/users/login
 * @description Login to account
 * @access public
 */
router.post("/login", validationMiddleware.login, (req, res) => {
    let { email, password } = req.body;
    try {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                res.status(400).json({
                    message: `User with email ${email} was not found`
                })
            } else {
                bcrypt.compare(password, user.password).then((isMatch) => {
                    if (!isMatch) {
                        res.status(401).json({
                            message: "Authentication failed"
                        })
                    } else {
                        const token = jwt.sign({
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            phone: user.phone
                        }, process.env.JWT_KEY, {
                            expiresIn: '72h'
                        });
                        res.status(200).json({
                            user,
                            token: token,
                            message: "User successfully authenticated",
                        });
                    }
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
})

/**
 * @route GET /api/users/profile
 * @description Get user details
 * @access private
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    let user = req.user;
    res.status(200).json({
        user
    })
})

module.exports = router;