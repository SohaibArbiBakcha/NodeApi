const express = require("express"); //server
const app = express();
const morgen = require("morgan"); // for chow us the state of request
const dotenv = require("dotenv"); // envirments var
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose"); // mongodb lib
const expressValidator = require("express-validator");

dotenv.config();

//db config

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  });

mongoose.connection.on("error", (err) => {
  console.log(`db connection error  : ${err.message}`);
});

//bring routes
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
//middelware
app.use(morgen("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRouter);
app.use("/", authRouter);
app.use("/", userRouter);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized" });
  }
});

const port = process.env.PORT || 8080;

app.listen(8080, () =>
  console.log(`the node Api lisenting at port :  ${port} `)
);