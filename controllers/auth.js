const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const expressJwt = require("express-jwt"); // for authorisation

dotenv.config();

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is taken !",
    });

  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "Signup success! Please login." });
};

exports.signin = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;
  //if error or no user
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user found make sure the email end the password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match",
      });
    }
    //generte a token with user id and secret key
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return respons with user and token to frontend cleint
    const { _id, email, name } = user;
    res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({
    message: "Singout success",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});
