const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// Create a new post (with tags)
router.post("/", postController.createPost);

// Get all posts (feed)
router.get("/", postController.getAllPosts);

// Get posts by tag
router.get("/tag/:tagName", postController.getPostsByTag);

// Get posts by user id
router.get("/user/:userId", postController.getPostsByUserId);

// Get a post by id
router.get("/:id", postController.getPostById);

// Update a post (including tags)
router.put("/:id", postController.updatePost);

// Add single tag to post
router.post("/:id/tags", postController.addTagToPost);

// Remove tag from post
router.delete("/:id/tags/:tagId", postController.removeTagFromPost);

// Delete a post
router.delete("/:id", postController.deletePost);

module.exports = router;