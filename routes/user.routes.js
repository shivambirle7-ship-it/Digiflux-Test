const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const validate = require('../middleware/validator.middleware');
const { signupSchema, loginSchema } = require('../validators/user.validator');

router.post('/signup', validate(signupSchema), userController.signup);
router.post('/login', validate(loginSchema), userController.login);

module.exports = router;
