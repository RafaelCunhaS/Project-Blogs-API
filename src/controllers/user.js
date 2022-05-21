const userService = require('../services/user');
const { CREATED, OK_STATUS } = require('../utils/statusCode');
const generateToken = require('../utils/generateToken');

const getAll = async (_req, res) => {
  const users = await userService.getAll();

  return res.status(OK_STATUS).json(users);
};

const create = async (req, res) => {
  await userService.create(req.body);

  const { email } = req.body;
  
  const token = generateToken(email);

  return res.status(CREATED).json({ token });
};

module.exports = {
  create,
  getAll,
};