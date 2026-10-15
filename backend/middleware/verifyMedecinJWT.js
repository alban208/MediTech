const jwt = require('jsonwebtoken');

const verifyMedecinJWT = (req, res, next) => {
    let token = null;
    
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }
    
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
                if (req.role !== 'MEDECIN') {
                    return res.status(403).json({ error: 'Access denied: medecin only' });
                }
                next();
            });
}

module.exports = verifyMedecinJWT;
