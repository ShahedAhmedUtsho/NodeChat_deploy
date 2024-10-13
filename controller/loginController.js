const jwt = require("jsonwebtoken");
const People = require("../Models/peopleSchema");
const bcrypt = require('bcrypt');
const createError = require("http-errors");


function getLogin(req, res, next) {
    res.render('login')
};

async function login(req, res, next) {
    const password = req.body.password;
    const username = req.body.username;
    try {
        const user = await People.findOne({
            $or: [{ email: username }, { mobile: username }
            ]
        })
        if (user && user._id) {
            const isCorrectPassword = await bcrypt.compare(password, user.password);
            if (isCorrectPassword) {
                const userObject = {
                    name: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    _id: user._id
                }
                const token = jwt.sign(userObject, process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                )

                res.cookie(process.env.LOGIN_TOKEN, token,
                    {
                        maxAge: 86400000,
                        httpOnly: true,
                        signed: true
                    })
                res.locals.LoggedInUser = userObject;

                res.json(userObject)

            } else {
                throw createError("wrong credentials .  Please try again.")

            }






        } else {
            console.log("user not found")
            throw createError("user is not found. Please try again.")

        }


    } catch (error) {
        console.log({
            data: {
                username: req.body.username
            },
            errors: {
                common: {
                    msg: error.message

                }
            }
        })
        res.status(error.status || 500).json({

            errors: {
                common: {
                    msg: error.message

                }
            }
        })

    }



}





module.exports = {
    getLogin,
    login
}