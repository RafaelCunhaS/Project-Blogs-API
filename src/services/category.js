const { Category } = require('../database/models');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT } = require('../utils/statusCode');

const getAll = async () => {
  const categories = await Category.findAll();
  return categories;
};

const create = async (name) => {
  const category = await Category.findOne({ where: { name } });

  if (category) throw errorFunction(CONFLICT, 'Category already registered');

  const { id } = await Category.create({ name });
  return id;
};

module.exports = {
  create,
  getAll,
};