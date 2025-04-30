const express = require('express');
const Recipe = require('../mongodb/models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET request (for all recipes)
router.get('/', authMiddleware, async (req, res) => {
    const limit = parseInt(req.query.limit) || 0; // default: no limit

    try {
        const recipes = await Recipe.find().limit(limit);
        res.status(200).json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recipes!' });
    }
});

// GET request for saved recipes
router.get('/saved', authMiddleware, async (req, res) => {
    try {
        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId).populate('savedRecipes');

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(user.savedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch saved recipes!' });
    }
});

// GET request for favourite recipes
router.get('/favourites', authMiddleware, async (req, res) => {
    try {
        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId).populate('likedRecipes');

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(user.likedRecipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch saved recipes!' });
    }
});

// GET request for searching recipes
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { title, time, tags, ingredients, cuisine } = req.query;

        const query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (time) {
            query.time = parseInt(time);
        }

        if (tags) {
            const tagArray = tags.split(',').map(t => t.trim());
            query.tags = { $all: tagArray };
        }

        if (ingredients) {
            const ingredientArray = ingredients.split(',').map(i => i.trim());
            query.ingredients = { $all: ingredientArray };
        }

        if (cuisine) {
            query.cuisine = { $regex: cuisine, $options: 'i' };
        }

        const recipes = await Recipe.find(query);

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found!' });
        }

        res.status(200).json(recipes);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Search failed, please try again later!' });
    }
});

// GET request (for all random recipe)
router.get("/random", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0;

        const recipes = await Recipe.aggregate([
            { $sample: { size: limit > 0 ? limit : await Recipe.countDocuments() } }
        ]);

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipes." });
    }
});

// GET request for the most popular recipes
router.get('/popular', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .sort({ likes: -1 }) // Sort descending by likes
            .limit(6);

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch most liked recipes" });
    }
});

// GET request (for a single recipe)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        const User = require('../mongodb/models/User');
        const user = await User.findById(req.userId);

        const isSaved = user.savedRecipes.includes(req.params.id);
        const isLiked = user.likedRecipes.includes(req.params.id);
        const isDisliked = user.dislikedRecipes.includes(req.params.id);

        res.status(200).json({ ...recipe.toObject(), isSaved, isLiked, isDisliked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recipe!' });
    }
});

module.exports = router;