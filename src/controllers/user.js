const userService = require('../services/user');
const { CREATED } = require('../utils/statusCode');
const generateToken = require('../utils/generateToken');

const create = async (req, res) => {
  await userService.create(req.body);

  const { email } = req.body;
  
  const token = generateToken(email);

  return res.status(CREATED).json({ token });
};

module.exports = {
  create,
};