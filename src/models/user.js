const { User } = require('../database/models');

const getByEmail = async (email) => {
  const user = User.findOne({ where: { email } });
  return user;
}

const create = async (object) => {
  const user = User.create(object);
  return user;
}

module.exports = {
  getByEmail,
  create
}