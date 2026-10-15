const jwt = require('jsonwebtoken');

const verifyLoggedJWT = (req, res, next) => {
    let token = null;

    // d'abord chercher dans cookies
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // sinon chercher dans l'Authorization header
    if (!token && req.headers['authorization']) {
        const authHeader = req.headers['authorization'];
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: err.message });
        }
        req.email = decoded.userInfos.email;
        req.role = decoded.userInfos.role;
        req.id = decoded.userInfos.id;
        next();
    });
};

module.exports = verifyLoggedJWT;
