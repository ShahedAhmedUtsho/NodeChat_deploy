const multer = require("multer");
const path = require('path')
const createError = require('http-errors')
function uploader(subfolder_path, allow_file_types, max_file_size, err_message) {

    const uploadFolder = `${__dirname}/../public/uploads/${subfolder_path}`

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadFolder)

        },


        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(/\.[^/.]+$/, "")
                    .toLowerCase()
                    .split(" ")
                    .join("-") + "-" + Date.now();
            cb(null, fileName + fileExt)

        }
    })





    const upload = multer({
        storage: storage,
        limits: {
            fileSize: max_file_size,
        },

        fileFilter: (req, file, cb) => {
            if (allow_file_types.includes(file.mimetype)) {
                cb(null, true)
            } else {

                const error = createError(400, err_message || 'invalid file type')

                cb(error)
            }

        }

    })

    return upload

}

module.exports = uploader