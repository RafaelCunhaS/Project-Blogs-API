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
  const { userId } = req.user;

  const post = await postService.create(userId, title, content, categoryIds);

  return res.status(CREATED).json(post);
};

const update = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { title, content } = req.body;

  const post = await postService.update(userId, id, title, content);

  return res.status(OK_STATUS).json(post);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
};