//const jwt = require('jsonwebtoken');

//const secretKey = 'MERIEM';

//function authenticateToken(req, res, next) {
    //const authHeader = req.headers['authorization'];
   // const token = authHeader && authHeader.split(' ')[1];
   // if (token == null) return res.sendStatus(401);

   // jwt.verify(token, secretKey, (err, user) => {
        //if (err) return res.sendStatus(403);
       // req.user = user;
        //next();
   // });
//}

//module.exports =  { authenticateToken,secretKey };
// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    next();
};

module.exports = { auth, admin };
