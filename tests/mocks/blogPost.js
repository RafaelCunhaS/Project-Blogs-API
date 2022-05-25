const BlogPost = require('./blogPosts.json');
const { Op } = require('sequelize');

const mockCreate = (Instance, data) => {
  if(!data){
    return;
  }

  const newData = data;
  if(!!Instance[0].id) {
    newData.id = Date.now();
  }
  Instance.push(newData);
  return newData;
};

const mockFindOne = (Instance, data) => {
  const user = Instance.find((user) => user.email === data.where.email);
  if (!user) return false;
  return user;
};

const mockFindById = (Instance, id) => {
  const post = Instance.find((post) => post.id === Number(id));
  if (!post) return false;
  return post;
}

const mockRemove = (Instance, id) => {
  const newData = Instance.filter((user) => user.id !== Number(id.where.id));
  Instance.push(newData);
  return;
}

const mockFindAll = (Instance, query) => {
  if (!query) query = '';
  else query = query.where[Op.or][0].title[Op.like].replace(/%/g, '');

  const regex = new RegExp(query);

  const newData = Instance
    .filter((post) => regex.test(post.title) || regex.test(post.content));

  return newData;
}

const mockUpdate = (Instance, data, id) => {
  const post = Instance.find((post) => post.id === Number(id.where.id));
  post.title = data.title;
  post.content = data.content;
  return post;
}

module.exports = {
  create: async (data) => mockCreate(BlogPost, data),
  findAll: async (query) => mockFindAll(BlogPost, query),
  findOne: async (data) => mockFindOne(BlogPost, data),
  findById: async (id) => mockFindById(BlogPost, id),
  update: async (data, id) => mockUpdate(BlogPost, data, id),
  remove: async (id) => mockRemove(BlogPost, id)
};