const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, no token provided!' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user to the request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized, invalid token!' });
    }
};

module.exports = authMiddleware;