const router = require('express').Router();
const validateLogin = require('../middlewares/validateLogin');
const loginController = require('../controllers/login');

router.post('/', validateLogin, loginController);

module.exports = router;