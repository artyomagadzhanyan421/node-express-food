const express = require('express');
const Recipe = require('../mongodb/models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recipes' });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recipe' });
    }
});



module.exports = router;