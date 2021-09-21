const db = require("../models");
const User = db.user;

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