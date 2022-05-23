const { BlogPost, User } = require('../database/models');

const getAll = async () => {
  const categories = await BlogPost.findAll();
  return categories;
};

const getById = async (id) => {
  const category = await BlogPost.findByPk(id, { include: { model: User, as: 'users' } });
  return category;
};

const create = async (userId, title, content, categoryIds) => {
  const post = await BlogPost.create({ userId, title, content, categoryIds });
  return post;
};

module.exports = {
  create,
  getAll,
  getById,
};