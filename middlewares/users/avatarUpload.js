const uploader = require("../../Utilities/singleFileUpload")

function avatarUpload(req, res, next) {

    const upload = uploader("avatar", ["image/jpg", "image/jpeg", "image/png"], 1000000);
    upload.any()(req, res, (error) => {
        if (error) {
            res.status(500).json({
                errors: {
                    avatar: {
                        message: error.message
                    }
                }
            })
        } else {


            if (req.files && req.files.length > 0) {
                next()
            } else {
                res.status(500).json({
                    errors: {
                        common: {
                            message: "avatar is required"
                        }
                    }
                })
            }


        }

    })
}

module.exports = avatarUpload