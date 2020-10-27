const validator = require("../helpers/validate");
const Validator = require("validatorjs");
const Users = require('../models/User');

/**
 * Validate register user form
 */
const register = (req, res, next) => {
    /**
     * Checks if incoming value already exist for unique and non-unique fields in the database
     * e.g email: required|email|exists:User,email
     */
    Validator.registerAsync("exist", function(value, attribute, req, passes) {
        if (!attribute)
            throw new Error("Specify Requirements i.e fieldName: exist:table,column");
        //split table and column
        let attArr = attribute.split(",");
        if (attArr.length !== 2)
            throw new Error(`Invalid format for validation rule on ${attribute}`);

        //assign array index 0 and 1 to table and column respectively
        const { 0: table, 1: column } = attArr;
        //define custom error message
        let msg =
            column == "email" ?
            `${column} has already been taken ` :
            `${column} already in use`;
        //check if incoming value already exists in the database
        Users.findOne({
            [column]: value
        }).then((result) => {
            if (result) {
                passes(false, msg); // return false if value exists
                return;
            }
            passes();
        });
    });
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
    // Tighten password policy
    Validator.register(
        "strict",
        (value) => passwordRegex.test(value),
        "password must contain at least one uppercase letter, one lowercase letter and one number"
    );
    const validationRule = {
        first_name: "required|string",
        last_name: "required|string",
        phone: "required|string|min:10|max:10",
        email: "required|email|exist:User,email",
        password: "required|string|min:6|confirmed|strict",
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: "Validation failed",
                data: err,
            });
        } else {
            next();
        }
    });
};

/**
 * Validate login user form
 */
const login = (req, res, next) => {
    const validationRule = {
        email: "required|email",
        password: "required|string",
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: "Validation failed",
                data: err,
            });
        } else {
            next();
        }
    });

};

module.exports = {
    register,
    login,
}