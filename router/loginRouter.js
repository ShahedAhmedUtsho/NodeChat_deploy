const express = require('express');

const decorateHtmlResponse = require('../middlewares/decorateHtmlResponse')


// internal import  
const { getLogin, login } = require('../controller/loginController');
const { loginValidatorHandler, loginValidator } = require('../middlewares/users/loginValidator');
const checkLogin = require('../middlewares/common/checkLogin');
const checkLoginPage = require('../middlewares/login/checkLoginPage');

const router = express.Router()
router.get('/', decorateHtmlResponse("login page"), checkLoginPage, getLogin);
router.post('/',
    loginValidator,
    loginValidatorHandler,
    login)

router.post('/logout', checkLogin, (req, res) => {

    res.clearCookie(process.env.LOGIN_TOKEN).json({
        message: "logout successfully"
    })
})


module.exports = router;