const userModel = require('../models/user');
const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST } = require('../utils/statusCode');

module.exports = async (email) => {
  const { id } = await userModel.getByEmail(email);
  
  if (!id) throw errorFunction(BAD_REQUEST, 'Invalid fields');

  return id;
};