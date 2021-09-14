const db = require("../models");
const User = db.user;

exports.getUserData = (req, res) => {
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
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

exports.postUserData = (req, res) => {
    User.findOne({
        where: {
            userID: req.query.id
        }
    }).then(user => {
        if (!user) 
            return res.status(404).send({ message: "Invalid userID" });
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