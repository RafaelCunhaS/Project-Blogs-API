const { Category } = require('../database/models');

const getAll = async () => {
  const categories = await Category.findAll();
  return categories;
}

const getByName = async (name) => {
  const category = await Category.findOne({ where: { name } });
  return category;
}

const create = async (name) => {
  const { id } = await Category.create({ name });
  return id;
};

module.exports = {
  create,
  getAll,
  getByName,
};