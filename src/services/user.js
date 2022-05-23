const { User } = require('../database/models');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT, NOT_FOUND } = require('../utils/statusCode');

const getAll = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  return users;
};

const getById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });

  if (!user) throw errorFunction(NOT_FOUND, 'User does not exist');

  return user;
};

const create = async (object) => {
  const { email } = object;
  const user = User.findOne({ where: { email } });

  if (user) throw errorFunction(CONFLICT, 'User already registered');

  const { id } = User.create(object);
  return id;
};

module.exports = {
  create,
  getAll,
  getById,
};