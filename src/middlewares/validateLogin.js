const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST } = require('../utils/statusCode');
const { User } = require('../database/models');

module.exports = async (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorFunction(BAD_REQUEST, 'Some required fields are missing'));
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(errorFunction(BAD_REQUEST, 'Invalid fields'));
  }

  return next();
};