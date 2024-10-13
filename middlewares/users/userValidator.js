
const { check, validationResult } = require('express-validator');
const People = require('../../Models/peopleSchema');
const createError = require('http-errors')
const { unlink } = require('fs');
const path = require('path')
const addUserValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage('only alphabet are allowed')
        .trim()
    ,
    check("mobile")
        .isLength({ min: 1 })

        .withMessage("number is required")
        .isNumeric()
        .withMessage('give a valid number')
        .trim()
        .custom(async (value) => {
            try {
                const user = await People.findOne({ mobile: value })
                if (user) {
                    throw createError(400, "mobile already Exist")

                }
            } catch (error) {
                throw createError(error.message)

            }

        })
    ,
    check('email').isEmail().withMessage('invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await People.findOne({ email: value })
                if (user) {
                    throw createError(400, "email already Exist")

                }
            } catch (error) {
                throw createError(error.message)

            }

        }),
    check('password')
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol")
]


const addUserValidatorHandler = (req, res, next) => {

    const errors = validationResult(req).mapped();
    if (Object.keys(errors).length === 0) {
        next()
    } else {
        if (req.files.length > 0) {
            const { filename } = req.files[0];

            unlink(
                path.join(`${__dirname}/../../public/uploads/avatar/${filename}`),

                (err) => {
                    if (err) {
                        console.log(err)
                    }

                }
            )

        }

        res.status(500).json({
            errors: errors
        })

    }

}

module.exports = {
    addUserValidators,
    addUserValidatorHandler
}; 