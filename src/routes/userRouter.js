const router = require('express').Router();
const rescue = require('express-rescue');
const userController = require('../controllers/user');
const validateUser = require('../middlewares/validateUser');
const validateAuth = require('../middlewares/auth');

router.get('/', validateAuth, rescue(userController.getAll));

router.get('/:id', validateAuth, rescue(userController.getById));

router.post('/', validateUser, rescue(userController.create));

router.delete('/me', validateAuth, rescue(userController.remove));

module.exports = router;