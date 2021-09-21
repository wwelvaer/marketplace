const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

/** get userdata
 * expected query param:
 * @param id userID 
 */
exports.getUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // send data
        res.status(200).send({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            gender: user.gender,
            address: user.address,
            birthDate: user.birthDate,
            phoneNumber: user.phoneNumber
        });
    })
};

/** update userdata
 * expected query param:
 * @param id userID
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param email
 * @param gender
 * @param address
 * @param birthDate
 * @param phoneNumber
 */
exports.postUserData = (req, res) => {
    // find user
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        // catch error
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
        // update data
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.gender = req.body.gender;
        user.address = req.body.address;
        user.birthDate = req.body.birthDate;
        user.phoneNumber = req.body.phoneNumber;
        user.save().then(user => {
            res.send({ message: "Userdata was updatet successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    })
};

/**
 * expected params in body:
 * @param oldPassword
 * @param newPassword
 */
exports.changePassword = (req, res) => {
    // finds user using webtoken
    User.findOne({
    where: {
        userID: req.userId
    }
    }).then(user => {
        // catch errors
        if (!user)
            return res.status(404).send({ message: "No user matching webtoken found"});
        if (!bcrypt.compareSync(req.body.oldPassword,user.authID))
            return res.status(401).send({message: "Invalid Password"});
        // save hashed password
        user.authID = bcrypt.hashSync(req.body.newPassword, 8) 
        user.save().then(_ => {
            res.send({message: "Password updated successfully"})
        })
    })
}