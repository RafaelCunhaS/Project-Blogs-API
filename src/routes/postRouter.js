const router = require('express').Router();
const rescue = require('express-rescue');
const postController = require('../controllers/post');
const validatePostCreation = require('../middlewares/validatePostCreation');
const validatePostUpdate = require('../middlewares/validatePostUpdate');
const validateAuth = require('../middlewares/auth');

router.get('/', validateAuth, rescue(postController.getAll));

router.get('/search', validateAuth, rescue(postController.getAll));

router.get('/:id', validateAuth, rescue(postController.getById));

router.post('/', validateAuth, validatePostCreation, rescue(postController.create));

router.put('/:id', validateAuth, validatePostUpdate, rescue(postController.update));

router.delete('/:id', validateAuth, rescue(postController.remove));

module.exports = router;