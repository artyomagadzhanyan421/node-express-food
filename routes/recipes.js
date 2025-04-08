const express = require('express');
const Recipe = require('../mongodb/models/Recipe');
const upload = require('../middleware/cloudinaryStorage');
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

router.post('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admins only!' });
    }
    next(); // continue to upload if admin
}, upload.single('picture'), async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            tags,
            time
        } = req.body;

        // Validate required fields
        if (
            !title || !description || !req.file || !ingredients || !tags || time === undefined
        ) {
            return res.status(400).json({ message: 'Missing required fields!' });
        }

        const recipe = new Recipe({
            title,
            description,
            ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients,
            tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
            time,
            picture: req.file.path,
            public_id: req.file.filename
        });

        const saved = await recipe.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create recipe!' });
    }
});

module.exports = router;