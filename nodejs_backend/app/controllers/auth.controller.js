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
 * @param userName
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
    userName: req.body.userName,
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
 * @param login
 */
exports.signin = (req, res) => {
  // finds user with given email or username
  User.findOne({
    where: req.body.login.includes("@") ? {
      email: req.body.login
    } : {
      userName: req.body.login
    }
  })
    .then(user => {
      if (!user)
        return res.status(404).send({ message: "User with given email / userName not found" });
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
        userName: user.userName,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};