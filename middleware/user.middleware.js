const jwt = require('jsonwebtoken');
const MSG = require('../constants/messages');

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.TOKEN_REQUIRED });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.ACCESS_DENIED });
            }

            next();
        } catch (error) {
            return res.status(401).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.INVALID_TOKEN });
        }
    };
};

module.exports = authorize;
