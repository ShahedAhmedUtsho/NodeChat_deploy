const { validationResult, check } = require('express-validator');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { memoryStorage } = require('multer');

const loginValidator = [
    check("username")
        .isLength({ min: 1 })
        .withMessage("username is required"),
    check('password')
        .isLength({ min: 1 })
        .withMessage("Inter the password")
]
const loginValidatorHandler = (req, res, next) => {

    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next()
    } else {
        res.status(500).json({

            errors: mappedErrors,

        })
    }



}



module.exports = {
    loginValidator,
    loginValidatorHandler
};