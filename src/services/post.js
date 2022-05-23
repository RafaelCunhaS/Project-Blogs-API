const Sequelize = require('sequelize');
const { BlogPost, PostCategory, Category, User } = require('../database/models');
const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/statusCode');
const config = require('../database/config/config');

const sequelize = new Sequelize(config.development);

const getAll = async () => {
  const posts = await BlogPost.findAll({ 
    include: [{ model: User, as: 'user', attributes: { exclude: 'password' } },
    { model: Category, as: 'categories', through: { attributes: [] } }],
  });

  return posts;
};

const getById = async (id) => {
  const post = await BlogPost.findByPk(id, { 
    include: [{ model: User, as: 'user', attributes: { exclude: 'password' } },
    { model: Category, as: 'categories', through: { attributes: [] } }],
  });

  if (!post) throw errorFunction(NOT_FOUND, 'Post does not exist');

  return post;
};

const create = async (userId, title, content, categoryIds) => {
  const { count } = await Category.findAndCountAll({ where: { id: categoryIds } });

  if (categoryIds.length !== count) {
    throw errorFunction(BAD_REQUEST, '"categoryIds" not found');
  }

  const result = await sequelize.transaction(async (t) => {
    const post = await BlogPost.create({ userId, title, content }, { transaction: t });

    const postCategories = categoryIds.map((categoryId) => ({ postId: post.id, categoryId }));
  
    await PostCategory.bulkCreate(postCategories, { transaction: t });

    return post;
  });

  return result;
};

module.exports = {
  create,
  getAll,
  getById,
};