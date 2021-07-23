const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err) {
        return res.status(400).json({ error: "Post not found" });
      }

      req.post = post;

      next();
    });
};

exports.getPosts = (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .select("title body")
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((error) => console.log(error));
};

exports.createPost = (req, res, next) => {
  let form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "photo could not be uploaded",
      });
    }

    let post = new Post(fields);
    console.log(req.profile);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = flies.photo.type;
    }

    post.save((err, result) => {
      if (err) {
        res.status(400).json({ error: err });
      }

      res.json(result);
    });
  });
};

exports.postByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      res.json(posts);
    });
};

exports.isPoster = (req, res, next) => {
  let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;

  if (!isPoster) {
    return res.status(403).json({
      error: "user not Authorized",
    });
  }
  next();
};

exports.updatePost = (req, res, next) => {
  let post = req.post;
  post = _.extend(post, req.body);
  post.updated = Date.now;
  post.save((err, post) => {
    if (err) {
      return res.status(403).json({ error: err });
    }

    res.json(post);
  });
};

exports.deletePost = (req, res) => {
  let post = req.post;

  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({
      message: "post deleted successfully",
    });
  });
};
