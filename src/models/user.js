const { User } = require('../database/models');

const getAll = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  return users;
}

const getById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
  return user;
}

const getByEmail = async (email) => {
  const user = User.findOne({ where: { email } });
  return user;
}

const create = async (object) => {
  const { id } = User.create(object);
  return id;
}

module.exports = {
  getByEmail,
  create,
  getAll,
  getById,
};