const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST } = require('../utils/statusCode');
const { User } = require('../database/models');

module.exports = async (body) => {
  const { email, password } = body;

  if (!email || !password) {
    throw errorFunction(BAD_REQUEST, 'Some required fields are missing');
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw errorFunction(BAD_REQUEST, 'Invalid fields');
  }

  return true;
};