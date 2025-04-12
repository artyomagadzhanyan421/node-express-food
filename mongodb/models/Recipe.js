const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    picture: { type: String, required: true },
    public_id: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    tags: { type: [String], required: true },
    time: { type: Number, required: true },
    title: { type: String, required: true },
    cuisine: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    adds: { type: Number, default: 0 },
    notes: { type: Number, default: 0 },
});

module.exports = mongoose.model('Recipe', recipeSchema);