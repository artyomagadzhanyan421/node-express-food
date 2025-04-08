const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    picture: String,
    notes: Number,
    adds: Number,
    description: String,
    dislikes: Number,
    ingredients: [String],
    likes: Number,
    tags: [String],
    time: Number
}, { timestamps: true });

module.exports = mongoose.model('recipes', recipeSchema);