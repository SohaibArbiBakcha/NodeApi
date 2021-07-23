exports.createPostValidator = (req, res, next) => {
  //title
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must between 6 to 150 characters").isLength({
    min: 6,
    max: 150,
  });

  //body
  req.check("body", "Write a body").notEmpty();
  req.check("body", "Body must between 6 to 2000 characters").isLength({
    min: 6,
    max: 2000,
  });
  // check for the errors

  const errors = req.validationErrors();

  //if error show the first one as they happen

  if (errors) {
    const firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  next();
};

exports.userSignupValidation = (req, res, next) => {
  //name is not bull between 4 to 10 char
  req.check("name", "Write a name, it is required").notEmpty();
  req.check("name", "Name must between 4 and 6 characters").isLength({
    min: 4,
    max: 10,
  });

  //email
  req.check("email", "Write an email, it is required").notEmpty();
  req.check("email", "please respect email format").isEmail();
  req
    .check("email", "must be like hello@example.com")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contains @")
    .isLength({
      min: 6,
      max: 2000,
    });

  //password
  req.check("password", "Write a password, it is required").notEmpty();
  req
    .check("password", "password must contains at 6 characters")
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage("password must contain a Number");

  // check for the errors

  const errors = req.validationErrors();

  //if error show the first one as they happen

  if (errors) {
    const firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({
      error: firstError,
    });
  }
  next();
};
