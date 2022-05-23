const postService = require('../services/post');
const { CREATED, OK_STATUS } = require('../utils/statusCode');

const getAll = async (_req, res) => {
  const posts = await postService.getAll();
  
  return res.status(OK_STATUS).json(posts);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const post = await postService.getById(id);

  res.status(OK_STATUS).json(post);
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
  getById,
};