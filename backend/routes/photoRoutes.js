const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

// Upload a photo
router.post("/", photoController.uploadPhoto);

// Get photos by recipe id
router.get("/recipe/:recipeId", photoController.getPhotosByRecipeId);

// Get a photo by id
router.get("/:id", photoController.getPhotoById);

// Update photo caption
router.put("/:id", photoController.updatePhotoCaption);

// Delete a photo
router.delete("/:id", photoController.deletePhoto);

module.exports = router;