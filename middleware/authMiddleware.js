const jwt = require('jsonwebtoken');
const Token = require('../mongodb/models/Token');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, no token provided!' });
    }

    const token = authHeader.split(' ')[1];

    // Check blacklist
    const isBlacklisted = await Token.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized, token has been revoked!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized, invalid token!' });
    }
};

module.exports = authMiddleware;