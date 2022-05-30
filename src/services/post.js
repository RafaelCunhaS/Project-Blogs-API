const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { BlogPost, PostCategory, Category, User } = require('../database/models');
const errorFunction = require('../utils/errorFunction');
const { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } = require('../utils/statusCode');
const config = require('../database/config/config');

const sequelize = new Sequelize(config.development);

const getAll = async (query) => {
  let { q } = query;
  if (!q) q = '';

  const posts = await BlogPost.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${q}%` } },
        { content: { [Op.like]: `%${q}%` } },
      ],
    },
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

const validateUser = async (userId, postId) => {
  const { user: { id } } = await getById(postId);

  if (id !== userId) throw errorFunction(UNAUTHORIZED, 'Unauthorized user');
};

const update = async (userId, id, title, content) => {
  await validateUser(userId, id);
  
  await BlogPost.update({ title, content }, { where: { id } });

  const post = await getById(id);

  return post;
};

const remove = async (userId, id) => {
  await validateUser(userId, id);
  await BlogPost.destroy({ where: { id } });
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  sequelize,
};