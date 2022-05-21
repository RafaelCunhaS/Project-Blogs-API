const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST } = require('../utils/statusCode');

module.exports = async (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorFunction(BAD_REQUEST, 'Some required fields are missing'));
  }

  return next();
};