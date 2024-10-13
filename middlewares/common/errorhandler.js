
const createError = require('http-errors')


// 404 not found  


function notFoundMiddleWare(req, res, next) {
    next(createError(404, "content is not found"))

}

// default  

function errorHandler(err, req, res, next) {




    res.locals.error = process.env.NODE_ENV === "development" ? err : { message: err.message };

    res.status(err.status || 500)
    if (res.locals.html) {
        // if (err.status === 404) {
        //     res.render('notFound')

        // }
        res.render('error', {
            title: "error page"
        })
    } else {

        res.json(res.locals.error)
    }


}

module.exports = {
    notFoundMiddleWare, errorHandler
}