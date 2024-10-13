
const bcrypt = require('bcrypt');
const People = require('../Models/peopleSchema');
const { unlink } = require('fs')
const path = require('path')
function getUsers(req, res, next) {
    res.render('users')

}

async function all(req, res, next) {

    const users = await People.find().select('-password -__v')

    res.json(users)

}



async function deleteUser(req, res, next) {
    const { id } = req.body;

    try {
        const user = await People.findByIdAndDelete(id);
        if (user) {

            unlink(
                path.join(`${__dirname}/../public/uploads/avatar/${user.avatar}`),

                (err) => {
                    console.log()
                    if (err) {
                        console.log(err)
                    }

                }
            )
            res.json({ message: "user deleted Successfully" })
        } else {
            res.status(404).json({
                message: "user not found"
            })
        }


    } catch (error) {
        res.status(500).send({
            message: "internal server error"

        })

    }


}


async function addUser(req, res, next) {
    let newUser;
    const hashPassword = await bcrypt.hash(req.body.password, 10);






    try {
        if (req.files && req.files.length > 0) {
            newUser = await new People({
                ...req.body,
                avatar: req.files[0].filename,
                password: hashPassword,
            })
            await newUser.save()

            res.json("okay");

        } else {
            res.status(500).json(
                {
                    errors: {
                        common: error.message,

                    }
                }
            )
        }


    } catch (error) {
        res.status(500).json(
            {
                errors: {
                    common: error.message,

                }
            }
        )
    }













}


module.exports = {
    getUsers,
    addUser,
    all,
    deleteUser
}; 