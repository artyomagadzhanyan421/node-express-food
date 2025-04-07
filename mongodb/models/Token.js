const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

module.exports = mongoose.model('tokens', tokenSchema);