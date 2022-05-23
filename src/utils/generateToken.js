const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (id, email) => {
  const jwtConfig = {
    expiresIn: '1h',
    algorithm: 'HS256',
  };
  
  const token = jwt.sign({ data: { id, email } }, process.env.JWT_SECRET, jwtConfig);

  return token;
};