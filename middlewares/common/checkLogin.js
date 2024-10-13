const jwt = require("jsonwebtoken");
const createError = require("http-errors");

function checkLogin(req, res, next) {
    const token = req?.signedCookies[process.env.LOGIN_TOKEN];
    if (!token) {
        if (!req.locals?.html) {
           
            return res.redirect('/');

        }
        else {

            return res.status(401).json({ error: 'Unauthorized' });
        }
    }


    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();


    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

module.exports = checkLogin;