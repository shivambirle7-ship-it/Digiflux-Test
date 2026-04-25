const userService = require('../services/user.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MSG = require('../constants/messages');

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await userService.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.EMAIL_EXISTS });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userService.createUser({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        res.status(201).json({
            status: MSG.STATUS.SUCCESS,
            message: MSG.AUTH.REGISTER_SUCCESS,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findByEmail(email);

        if (!user) {
            return res.status(401).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.INVALID_CREDENTIALS });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: MSG.STATUS.ERROR, message: MSG.AUTH.INVALID_CREDENTIALS });
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        });

        res.status(200).json({
            status: MSG.STATUS.SUCCESS,
            message: MSG.AUTH.LOGIN_SUCCESS,
            data: { token, user: payload },
        });
    } catch (error) {
        res.status(500).json({ status: MSG.STATUS.ERROR, message: error.message });
    }
};

module.exports = {
    signup,
    login
};
