const SharedRecipe = require("../models/Sharedrecipe");

// SHARE RECIPE WITH FRIEND
exports.shareRecipe = async (req, res) => {
  const {
    recipeId,
    sharedBy,
    sharedWith,
  } = req.body;

  try {
    // Validate required fields
    if (!recipeId || !sharedBy || !sharedWith) {
      return res
        .status(400)
        .json({ message: "Recipe ID, Shared By, and Shared With are required" });
    }

    // Check if recipe is already shared with this user
    const existingShare = await SharedRecipe.findSharedRecipe(
      recipeId,
      sharedBy,
      sharedWith
    );

    if (existingShare) {
      return res.status(409).json({
        message: "Recipe already shared with this user",
      });
    }

    const sharedRecipe = await SharedRecipe.create({
      recipeId,
      sharedBy,
      sharedWith,
    });

    res.status(201).json({
      message: "Recipe shared successfully",
      sharedRecipe,
    });
  } catch (error) {
    console.error("Error sharing recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET RECIPES SHARED WITH USER
exports.getRecipesSharedWithUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const sharedRecipes = await SharedRecipe.getRecipesSharedWithUser(userId);

    res.status(200).json({
      message: "Shared recipes retrieved successfully",
      count: sharedRecipes.length,
      sharedRecipes,
    });
  } catch (error) {
    console.error("Error retrieving shared recipes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET RECIPES SHARED BY USER
exports.getRecipesSharedByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const sharedRecipes = await SharedRecipe.getRecipesSharedByUser(userId);

    res.status(200).json({
      message: "Recipes shared by user retrieved successfully",
      count: sharedRecipes.length,
      sharedRecipes,
    });
  } catch (error) {
    console.error("Error retrieving recipes shared by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UNSHARE RECIPE (DELETE SHARED RECIPE)
exports.unshareRecipe = async (req, res) => {
  const { id: sharedRecipeId } = req.params;
  const { userId } = req.body;

  try {
    if (!sharedRecipeId || !userId) {
      return res
        .status(400)
        .json({ message: "Shared Recipe ID and User ID are required" });
    }

    const deletedShare = await SharedRecipe.delete(sharedRecipeId, userId);

    if (!deletedShare) {
      return res
        .status(404)
        .json({ message: "Shared recipe not found or unauthorized" });
    }

    res.status(200).json({
      message: "Recipe unshared successfully",
      sharedRecipeId: deletedShare.id,
    });
  } catch (error) {
    console.error("Error unsharing recipe:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};