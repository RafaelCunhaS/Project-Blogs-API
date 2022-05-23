const postService = require('../services/post');
const { CREATED } = require('../utils/statusCode');

const getAll = async () => {
  const categories = await postService.getAll();
  return categories;
};

const create = async (req, res) => {
  const { title, content, categoryIds } = req.body;
  const { id: userId } = req.user;

  const post = await postService.create(userId, title, content, categoryIds);

  return res.status(CREATED).json(post);
};

module.exports = {
  create,
  getAll,
};