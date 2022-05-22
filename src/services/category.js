const categoryModel = require('../models/category');

const create = async (name) => {
  const category = await categoryModel.create(name);
  return category;
};

module.exports = {
  create,
};