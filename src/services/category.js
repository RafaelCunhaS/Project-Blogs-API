const categoryModel = require('../models/category');
const errorFunction = require('../utils/errorFunction');
const { CONFLICT } = require('../utils/statusCode');

const getAll = async () => {
  const categories = await categoryModel.getAll();
  return categories;
};

const create = async (name) => {
  const category = await categoryModel.getByName(name);

  if (category) throw errorFunction(CONFLICT, 'Category already registered');

  const id = await categoryModel.create(name);
  return id;
};

module.exports = {
  create,
  getAll,
};