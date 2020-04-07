const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // Bearer fdsfdfs
    if (!token || token === '') {
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretkey');
    } catch(err) {
        req.isAuth = false;
        return next();
    }
    if (!decodedTokent){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};




