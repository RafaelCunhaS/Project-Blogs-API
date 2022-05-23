const router = require('express').Router();
const rescue = require('express-rescue');
const postController = require('../controllers/post');
const validatePost = require('../middlewares/validatePost');
const validateAuth = require('../middlewares/auth');

router.get('/', validateAuth, rescue(postController.getAll));

router.get('/:id', validateAuth, rescue(postController.getById));

router.post('/', validateAuth, validatePost, rescue(postController.create));

module.exports = router;