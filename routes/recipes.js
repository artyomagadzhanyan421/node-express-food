const express = require('express');
const Recipe = require('../mongodb/models/Recipe');
const upload = require('../middleware/cloudinaryStorage');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('../utils/cloudinary');

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

// GET request (for a single recipe)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }
        res.status(200).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch recipe!' });
    }
});

// POST request (to create new recipe)
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
            time,
            cuisine
        } = req.body;

        // Validate required fields
        if (
            !title || !description || !req.file || !ingredients || !cuisine || !tags || time === undefined
        ) {
            return res.status(400).json({ message: 'Missing required fields!' });
        }

        const recipe = new Recipe({
            title,
            description,
            ingredients: typeof ingredients === 'string' ? ingredients.split(',').map(i => i.trim()) : ingredients,
            tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
            time,
            cuisine,
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

// DELETE request (to delete recipe)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden, admins only!' });
        }

        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(recipe.public_id);

        // Delete recipe from DB
        await recipe.deleteOne();

        res.status(200).json({ message: 'Recipe deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete recipe!' });
    }
});

// PUT request (to updated an existitng recipe)
router.put('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admins only!' });
    }
    next();
}, upload.single('picture'), async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found!' });
        }

        const updatableFields = ['title', 'description', 'ingredients', 'tags', 'time', 'cuisine'];
        const updateFields = {};

        for (let key of updatableFields) {
            if (req.body[key] !== undefined) {
                let value = req.body[key];

                // Convert stringified arrays to proper arrays
                if (['ingredients', 'tags'].includes(key)) {
                    value = typeof value === 'string' ? value.split(',').map(v => v.trim()) : value;
                }

                // If it's an array or string, make sure it's not empty
                if (
                    (Array.isArray(value) && (!value.length || value.some(v => !v.trim()))) ||
                    (typeof value === 'string' && !value.trim())
                ) {
                    return res.status(400).json({ message: 'Fields cannot be empty!' });
                }

                updateFields[key] = value;
            }
        }

        // Handle image update
        if (req.file) {
            await cloudinary.uploader.destroy(recipe.public_id);
            updateFields.picture = req.file.path;
            updateFields.public_id = req.file.filename;
        }

        // Apply updates
        Object.assign(recipe, updateFields);
        const updated = await recipe.save();

        res.status(200).json(updated);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update recipe!' });
    }
});

module.exports = router;