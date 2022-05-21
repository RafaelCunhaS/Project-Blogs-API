const userModel = require('../models/user');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT } = require('../utils/statusCode');

const create = async (object) => {
  const { email } = object;
  const user = await userModel.getByEmail(email);

  if (user) throw errorFunction(CONFLICT, 'User already registered');

  const createdUser = await userModel.create(object);
  return createdUser;
};

module.exports = {
  create,
};