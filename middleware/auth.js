const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')

    // Check for token
    if (!token) 
        return res.status(401).json({message: 'No token sent!'})
    
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);

        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({message: 'Invalid token'})
    }
}

module.exports = auth;