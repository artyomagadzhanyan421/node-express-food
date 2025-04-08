const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    ingredient: String,
    ingreditnsDesc: String
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    picture: String,
    notes: Number,
    adds: Number,
    description: String,
    dislikes: Number,
    ingredients: [ingredientSchema],
    likes: Number,
    tags: [String],
    time: Number
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);