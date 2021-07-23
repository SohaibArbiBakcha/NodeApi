const User = require("../models/user");
const _ = require("lodash");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    req.profile = user; // adds profile obejcts to the request

    next();
  });
};

exports.userHasAuthorized = (req, res, next) => {
  const authorize = req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorize) {
    return res
      .status(403)
      .json({ error: "user not authorized to perform this action" });
  }

  next();
};

exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({ users });
  }).select("name email updated created");
};

exports.getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.status(400).json({
        error: "You are not authorized to perform this action",
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  });
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "User deleted successfully" });
  });
};

// {
//     "name" : "admin",
//     "email" :"admin@mongodb.com",
//     "password" : "admin123"

// }
// {
//     "name" : "sohaib",
//     "email" :"sohaib@mongodb.com",
//     "password" : "admin123"

// }
