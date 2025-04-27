const express = require('express');
const Recipe = require('../mongodb/models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST request (to like recipe)
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId);

        if (!user.likedRecipes.includes(req.params.id)) {
            recipe.likes += 1;
            user.likedRecipes.push(req.params.id);

            // If recipe was disliked before, remove that
            if (user.dislikedRecipes.includes(req.params.id)) {
                recipe.dislikes -= 1;
                user.dislikedRecipes.pull(req.params.id);
            }

            await recipe.save();
            await user.save();
        }

        res.status(200).json({ message: "Recipe liked!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to like recipe!" });
    }
});

// DELETE request (to unlike recipe)
router.delete('/:id/unlike', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        // Prevent likes from going below 0
        recipe.likes = Math.max(0, recipe.likes - 1);
        await recipe.save();

        const User = require('../mongodb/models/User');
        await User.findByIdAndUpdate(
            userId,
            { $pull: { likedRecipes: recipeId } }
        );

        res.status(200).json({ message: 'Recipe unliked successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unlike recipe!' });
    }
});

// Dislike a recipe
router.post('/:id/dislike', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId);

        // Prevent double-dislike
        if (!user.dislikedRecipes.includes(req.params.id)) {
            recipe.dislikes += 1;
            user.dislikedRecipes.push(req.params.id);

            // If user had previously liked it, remove the like
            if (user.likedRecipes.includes(req.params.id)) {
                recipe.likes -= 1;
                user.likedRecipes.pull(req.params.id);
            }

            await recipe.save();
            await user.save();
        }

        res.status(200).json({ message: "Recipe disliked!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to dislike recipe!" });
    }
});

// Remove dislike
router.delete('/:id/undislike', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found!" });
        }

        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId);

        if (user.dislikedRecipes.includes(req.params.id)) {
            recipe.dislikes -= 1;
            user.dislikedRecipes.pull(req.params.id);

            await recipe.save();
            await user.save();
        }

        res.status(200).json({ message: "Recipe undisliked!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to undislike recipe!" });
    }
});

module.exports = router;