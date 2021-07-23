const express = require("express");
const {
  getPosts,
  createPost,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
} = require("../controllers/post");
const { createPostValidator } = require("../validator");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const router = express.Router();

router.get("/", getPosts);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);

router.get("/post/by/:userId", requireSignin, postByUser);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);

// any routes containing userId
router.param("userId", userById);
// any routes containing postId
router.param("postId", postById);

module.exports = router;
