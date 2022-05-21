const router = require('express').Router();
const rescue = require('express-rescue');
const userController = require('../controllers/user');
const validateUser = require('../middlewares/validateUser');

router.post('/', validateUser, rescue(userController.create));

module.exports = router;