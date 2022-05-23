const postModel = require('../models/post');
// const errorFunction = require('../utils/errorFunction');

const getAll = async () => {
  const categories = await postModel.getAll();
  return categories;
};

const getById = async (id) => {
  const category = await postModel.getById(id);
  return category;
};

const create = async (userId, title, content, categoryIds) => {
  const post = await postModel.create(userId, title, content, categoryIds);
  return post;
};

module.exports = {
  create,
  getAll,
  getById,
};