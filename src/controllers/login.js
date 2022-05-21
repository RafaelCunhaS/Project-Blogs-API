const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OK_STATUS } = require('../utils/statusCode');

module.exports = async (req, res) => {
  const { email } = req.body;

  const jwtConfig = {
    expiresIn: '1h',
    algorithm: 'HS256',
  };
  
  const token = jwt.sign({ data: { email } }, process.env.JWT_SECRET, jwtConfig);

  res.status(OK_STATUS).json({ token });
};