const userModel = require('../models/user');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT, NOT_FOUND } = require('../utils/statusCode');

const getAll = async () => {
  const users = await userModel.getAll();
  return users;
};

const getById = async (id) => {
  const user = await userModel.getById(id);

  if (!user) throw errorFunction(NOT_FOUND, 'User does not exist');

  return user;
};

const getByEmail = async (email) => {
  const user = await userModel.getByEmail(email);
  return user;
};

const create = async (object) => {
  const { email } = object;
  const user = await getByEmail(email);

  if (user) throw errorFunction(CONFLICT, 'User already registered');

  const id = await userModel.create(object);
  return id;
};

module.exports = {
  create,
  getByEmail,
  getAll,
  getById,
};