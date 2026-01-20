const Post = require("../models/Post");
const Tag = require("../models/Tag");
const PostTag = require("../models/Posttag");

// CREATE POST WITH TAGS (BE/US 3)
exports.createPost = async (req, res) => {
  const {
    userId,
    recipeId,
    profilePhotoUrl,
    caption,
    tags, // Array of tag names: ["christmas", "budget", "carnote"]
  } = req.body;

  try {
    // Validate required fields
    if (!userId || !recipeId) {
      return res
        .status(400)
        .json({ message: "User ID and Recipe ID are required" });
    }

    // Create the post first
    const post = await Post.create({
      userId,
      recipeId,
      profilePhotoUrl,
      caption,
    });

    // If tags are provided, add them to the post
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagIds = [];
      
      for (const tagName of tags) {
        if (tagName && tagName.trim()) {
          // Find or create tag
          const tag = await Tag.findOrCreate(tagName);
          tagIds.push(tag.id);
          
          // Link tag to post
          await PostTag.addTagToPost(post.id, tag.id);
        }
      }
    }

    // Fetch the complete post with tags
    const completePost = await Post.findById(post.id);

    res.status(201).json({
      message: "Post created successfully",
      post: completePost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET POST BY ID
exports.getPostById = async (req, res) => {
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      post,
    });
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET POSTS BY USER ID
exports.getPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.findByUserId(userId);

    res.status(200).json({
      message: "Posts retrieved successfully",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET ALL POSTS (FEED)
exports.getAllPosts = async (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  try {
    const posts = await Post.getAllPosts(parseInt(limit), parseInt(offset));

    res.status(200).json({
      message: "Posts retrieved successfully",
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET POSTS BY TAG
exports.getPostsByTag = async (req, res) => {
  const { tagName } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  try {
    const posts = await PostTag.getPostsByTagName(
      tagName,
      parseInt(limit),
      parseInt(offset)
    );

    res.status(200).json({
      message: "Posts retrieved successfully",
      tag: tagName,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Error retrieving posts by tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE POST (INCLUDING TAGS)
exports.updatePost = async (req, res) => {
  const { id: postId } = req.params;
  const { userId, caption, profilePhotoUrl, tags } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Update basic post info
    const post = await Post.update(postId, userId, {
      caption,
      profilePhotoUrl,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove all existing tags
      await PostTag.removeAllTagsFromPost(postId);

      // Add new tags
      for (const tagName of tags) {
        if (tagName && tagName.trim()) {
          const tag = await Tag.findOrCreate(tagName);
          await PostTag.addTagToPost(postId, tag.id);
        }
      }
    }

    // Fetch complete updated post
    const completePost = await Post.findById(postId);

    res.status(200).json({
      message: "Post updated successfully",
      post: completePost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADD TAG TO POST
exports.addTagToPost = async (req, res) => {
  const { id: postId } = req.params;
  const { tagName } = req.body;

  try {
    if (!tagName || !tagName.trim()) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // Find or create tag
    const tag = await Tag.findOrCreate(tagName);

    // Add tag to post
    await PostTag.addTagToPost(postId, tag.id);

    // Get updated post
    const post = await Post.findById(postId);

    res.status(200).json({
      message: "Tag added to post successfully",
      post,
    });
  } catch (error) {
    console.error("Error adding tag to post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// REMOVE TAG FROM POST
exports.removeTagFromPost = async (req, res) => {
  const { id: postId, tagId } = req.params;

  try {
    await PostTag.removeTagFromPost(postId, tagId);

    // Get updated post
    const post = await Post.findById(postId);

    res.status(200).json({
      message: "Tag removed from post successfully",
      post,
    });
  } catch (error) {
    console.error("Error removing tag from post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const { userId } = req.body;

  try {
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "Post ID and User ID are required" });
    }

    const deletedPost = await Post.delete(postId, userId);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      postId: deletedPost.id,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};