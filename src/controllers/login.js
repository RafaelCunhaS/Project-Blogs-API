const generateToken = require('../utils/generateToken');
const { OK_STATUS } = require('../utils/statusCode');

module.exports = async (req, res) => {
  const { email } = req.body;

  const token = generateToken(email);

  res.status(OK_STATUS).json({ token });
};