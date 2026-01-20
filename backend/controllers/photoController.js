const Photo = require("../models/Photo");

// UPLOAD PHOTO
exports.uploadPhoto = async (req, res) => {
  const {
    recipeId,
    userId,
    photoUrl,
    caption,
  } = req.body;

  try {
    // Validate required fields
    if (!recipeId || !userId || !photoUrl) {
      return res
        .status(400)
        .json({ message: "Recipe ID, User ID, and Photo URL are required" });
    }

    const photo = await Photo.create({
      recipeId,
      userId,
      photoUrl,
      caption,
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photo,
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET PHOTOS BY RECIPE ID
exports.getPhotosByRecipeId = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const photos = await Photo.findByRecipeId(recipeId);

    res.status(200).json({
      message: "Photos retrieved successfully",
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.error("Error retrieving photos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET PHOTO BY ID
exports.getPhotoById = async (req, res) => {
  const { id: photoId } = req.params;

  try {
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json({
      message: "Photo retrieved successfully",
      photo,
    });
  } catch (error) {
    console.error("Error retrieving photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE PHOTO CAPTION
exports.updatePhotoCaption = async (req, res) => {
  const { id: photoId } = req.params;
  const { userId, caption } = req.body;

  try {
    if (!userId || !caption) {
      return res
        .status(400)
        .json({ message: "User ID and caption are required" });
    }

    const photo = await Photo.updateCaption(photoId, userId, caption);

    if (!photo) {
      return res
        .status(404)
        .json({ message: "Photo not found or unauthorized" });
    }

    res.status(200).json({
      message: "Photo caption updated successfully",
      photo,
    });
  } catch (error) {
    console.error("Error updating photo caption:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE PHOTO
exports.deletePhoto = async (req, res) => {
  const { id: photoId } = req.params;
  const { userId } = req.body;

  try {
    if (!photoId || !userId) {
      return res
        .status(400)
        .json({ message: "Photo ID and User ID are required" });
    }

    const deletedPhoto = await Photo.delete(photoId, userId);

    if (!deletedPhoto) {
      return res
        .status(404)
        .json({ message: "Photo not found or unauthorized" });
    }

    res.status(200).json({
      message: "Photo deleted successfully",
      photoId: deletedPhoto.id,
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};