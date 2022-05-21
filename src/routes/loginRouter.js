const router = require('express').Router();
const rescue = require('express-rescue');
const validateLogin = require('../middlewares/validateLogin');
const loginController = require('../controllers/login');

router.post('/', validateLogin, rescue(loginController));

module.exports = router;