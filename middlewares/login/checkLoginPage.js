const checkLoginPage = (req, res, next) => {
    const loginPath = '/';
    const inboxPath = '/inbox';
    const token = req.signedCookies[process.env.LOGIN_TOKEN];

    if (req.path === loginPath && token) {
        console.log("user is already logged in")
        return res.redirect(inboxPath);
    } else {
        next()
    }


};

module.exports = checkLoginPage;