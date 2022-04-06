const express = require("express"); //server
const app = express();
const morgen = require("morgan"); // for show us the state of request
const dotenv = require("dotenv"); // envirments var
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose"); // mongodb lib
const expressValidator = require("express-validator");
const fs = require("fs");
const cors = require("cors");

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
//api docs route

app.get("/", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    console.log(data);
    const docs = JSON.parse(data);
    res.json(docs);
  });
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
app.use(cors());
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
