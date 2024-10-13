const express = require('express');


const router = express.Router();
const decorateHtmlResponse = require('../middlewares/decorateHtmlResponse');
const {
    getUsers,
    addUser,
    all,
    deleteUser
} = require('../controller/userController');
const avatarUpload = require('../middlewares/users/avatarUpload');
const {
    addUserValidators,
    addUserValidatorHandler
} = require('../middlewares/users/userValidator');
const checkLogin = require('../middlewares/common/checkLogin');

router.get('/', checkLogin, decorateHtmlResponse("Users"), getUsers);
// add user 
router.get('/all', all);
router.post("/", checkLogin, avatarUpload, addUserValidators, addUserValidatorHandler, addUser);
router.delete("/", checkLogin, deleteUser)
module.exports = router; 