const express = require('express');
const Recipe = require('../mongodb/models/Recipe.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// POST request (to save recipe)
router.post('/:id/save', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // From authMiddleware
        const recipeId = req.params.id;

        // 1. Update the recipe (increase adds by 1)
        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { $inc: { adds: 1 } },
            { new: true }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        // 2. Add recipe to user's saved recipes
        const User = require('../mongodb/models/User.js'); // import your User model
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { savedRecipes: recipeId } } // $addToSet prevents duplicates
        );

        res.status(200).json({ message: 'Recipe saved successfully!', recipe });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save recipe!' });
    }
});

// DELETE request (to unsave recipe)
router.delete('/:id/unsave', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.id;

        // 1. Update the recipe (decrease adds by 1, but not below 0)
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        // Prevent adds from going below 0
        recipe.adds = Math.max(0, recipe.adds - 1);
        await recipe.save();

        // 2. Remove recipe from user's saved recipes
        const User = require('../mongodb/models/User.js');
        await User.findByIdAndUpdate(
            userId,
            { $pull: { savedRecipes: recipeId } } // $pull removes the item
        );

        res.status(200).json({ message: 'Recipe unsaved successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unsave recipe!' });
    }
});

module.exports = router;