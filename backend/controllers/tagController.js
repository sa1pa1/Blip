const Tag = require("../models/Tag");
const PostTag = require("../models/Posttag");

// GET ALL TAGS
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.getAllTags();

    res.status(200).json({
      message: "Tags retrieved successfully",
      count: tags.length,
      tags,
    });
  } catch (error) {
    console.error("Error retrieving tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SEARCH TAGS
exports.searchTags = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q || !q.trim()) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const tags = await Tag.searchTags(q);

    res.status(200).json({
      message: "Tags found successfully",
      count: tags.length,
      tags,
    });
  } catch (error) {
    console.error("Error searching tags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET TRENDING TAGS
exports.getTrendingTags = async (req, res) => {
  const { limit = 10 } = req.query;

  try {
    const tags = await Tag.getTrendingTags(parseInt(limit));

    res.status(200).json({
      message: "Trending tags retrieved successfully",
      count: tags.length,
      tags,
    });
  } catch (error) {
    console.error("Error retrieving trending tags:", error);
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