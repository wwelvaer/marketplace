const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/** creates user
 * expected params in body (not required):
 * @param firstName
 * @param lastName
 * @param password
 * @param email
 * @param gender
 * @param address
 * @param birthDate
 * @param phoneNumber
 */
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    authID: bcrypt.hashSync(req.body.password, 8), // hash password
    email: req.body.email,
    gender: req.body.gender,
    address: req.body.address,
    birthDate: req.body.birthDate,
    phoneNumber: req.body.phoneNumber
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

/**
 * expected params in body:
 * @param password
 * @param email
 */
exports.signin = (req, res) => {
  // finds user with given email
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user)
        return res.status(404).send({ message: "User with given email not found" });
      //check password
      if (!bcrypt.compareSync(req.body.password,user.authID))
        return res.status(401).send({accessToken: null,message: "Invalid Password"});
      //create webtoken
      var token = jwt.sign({ id: user.userID }, config.KEY, {
        expiresIn: 86400 // 24 hours
      });
      //send userdata
      res.status(200).send({
        id: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};