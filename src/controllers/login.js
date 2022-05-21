const generateToken = require('../utils/generateToken');
const { OK_STATUS } = require('../utils/statusCode');
const userService = require('../services/user');

module.exports = async (req, res) => {
  const { email } = req.body;

  await userService.getByEmail(email);

  const token = generateToken(email);

  res.status(OK_STATUS).json({ token });
};