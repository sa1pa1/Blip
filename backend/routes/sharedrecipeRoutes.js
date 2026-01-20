const express = require("express");
const router = express.Router();
const sharedRecipeController = require("../controllers/sharedrecipeController");

// Share a recipe
router.post("/", sharedRecipeController.shareRecipe);

// Get recipes shared with user
router.get("/received/:userId", sharedRecipeController.getRecipesSharedWithUser);

// Get recipes shared by user
router.get("/sent/:userId", sharedRecipeController.getRecipesSharedByUser);

// Unshare a recipe
router.delete("/:id", sharedRecipeController.unshareRecipe);

module.exports = router;