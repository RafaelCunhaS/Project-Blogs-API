const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (userId, email) => {
  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };
  
  const token = jwt.sign({ data: { userId, email } }, process.env.JWT_SECRET, jwtConfig);

  return token;
};