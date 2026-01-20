const Recipe = require("../models/Recipe");

// CREATE RECIPE (BE/US 1)
exports.createRecipe = async (req, res) => {
  const {
    userId,
    recipeTitle,
    fullName,
    profile,
  } = req.body;

  try {
    // Validate required fields
    if (!userId || !recipeTitle) {
      return res
        .status(400)
        .json({ message: "User ID and recipe title are required" });
    }

    const recipe = await Recipe.create({
      userId,
      recipeTitle,
      fullName,
      profile,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE RECIPE
exports.updateRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const { userId, recipeTitle, fullName, profile } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const recipe = await Recipe.update(recipeId, userId, {
      recipeTitle,
      fullName,
      profile,
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET RECIPES BY USER ID
exports.getRecipesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const recipes = await Recipe.findByUserId(userId);

    res.status(200).json({
      message: "Recipes retrieved successfully",
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error("Error retrieving recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET RECIPE BY RECIPE ID
exports.getRecipeById = async (req, res) => {
  const { id: recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({
      message: "Recipe retrieved successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error retrieving recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE RECIPE
exports.deleteRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const { userId } = req.body;

  try {
    // Validate input
    if (!recipeId || !userId) {
      return res
        .status(400)
        .json({ message: "Recipe ID and User ID are required" });
    }

    const deletedRecipe = await Recipe.delete(recipeId, userId);

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe not found or unauthorized" });
    }

    res.status(200).json({
      message: "Recipe deleted successfully",
      recipeId: deletedRecipe.id,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};