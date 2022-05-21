const generateToken = require('../utils/generateToken');
const { OK_STATUS } = require('../utils/statusCode');
const checkUser = require('../services/login');

module.exports = async (req, res) => {
  const { email } = req.body;

  await checkUser(email);

  const token = generateToken(email);

  res.status(OK_STATUS).json({ token });
};