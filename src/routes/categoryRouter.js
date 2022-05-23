const router = require('express').Router();
const rescue = require('express-rescue');
const categoryController = require('../controllers/category');
const validateCategory = require('../middlewares/validateCategory');
const validateAuth = require('../middlewares/auth');

router.get('/', validateAuth, rescue(categoryController.getAll));

router.post('/', validateAuth, validateCategory, rescue(categoryController.create));

module.exports = router;