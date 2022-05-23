const userService = require('../services/user');
const { CREATED, OK_STATUS, NO_CONTENT } = require('../utils/statusCode');
const generateToken = require('../utils/generateToken');

const getAll = async (_req, res) => {
  const users = await userService.getAll();

  return res.status(OK_STATUS).json(users);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getById(id);

  return res.status(OK_STATUS).json(user);
};

const create = async (req, res) => {
  const id = await userService.create(req.body);

  const { email } = req.body;
  
  const token = generateToken(id, email);

  return res.status(CREATED).json({ token });
};

const remove = async (req, res) => {
  const { userId } = req.user;

  await userService.remove(userId);

  return res.status(NO_CONTENT).end();
};

module.exports = {
  create,
  getAll,
  getById,
  remove,
};