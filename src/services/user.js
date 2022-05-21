const userModel = require('../models/user');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT } = require('../utils/statusCode');

const getAll = async () => {
  const users = await userModel.getAll();
  return users;
};

const getByEmail = async (email) => {
  const user = await userModel.getByEmail(email);
  return user;
};

const create = async (object) => {
  const { email } = object;
  const user = await getByEmail(email);

  if (user) throw errorFunction(CONFLICT, 'User already registered');

  await userModel.create(object);
};

module.exports = {
  create,
  getByEmail,
  getAll,
};