const { User } = require('../database/models');
const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST } = require('../utils/statusCode');

module.exports = async (email) => {
  const user = await User.findOne({ where: { email } });
  
  if (!user) throw errorFunction(BAD_REQUEST, 'Invalid fields');

  return user.id;
};