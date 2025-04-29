const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }],
    dislikedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'recipes' }]
});

module.exports = mongoose.model('users', userSchema);