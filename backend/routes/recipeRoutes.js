const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Create a new recipe
router.post("/", recipeController.createRecipe);

// Update a recipe
router.put("/:id", recipeController.updateRecipe);

// Get recipes by user id
router.get("/user/:userId", recipeController.getRecipesByUserId);

// Get a recipe by id
router.get("/:id", recipeController.getRecipeById);

// Delete a recipe
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;