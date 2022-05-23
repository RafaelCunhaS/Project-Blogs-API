const postService = require('../services/post');
const { CREATED, OK_STATUS, NO_CONTENT } = require('../utils/statusCode');

const getAll = async (req, res) => {
  const posts = await postService.getAll(req.query);
  
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

const remove = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  await postService.remove(userId, id);

  return res.status(NO_CONTENT).end();
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};