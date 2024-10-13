
const decorateHtmlResponse = (title) => {
    return function (req, res, next) {
        res.locals.title = `${process.env.APP_NAME} - ${title}`;
        res.locals.html = true;
        res.locals.LoggedInUser = {};
        res.locals.errors = {};

        res.locals.data = {};
        next()
    }
};

module.exports = decorateHtmlResponse;
