const Categories = require('./Categories.json');

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
  const category = Instance.find((category) => category.name === data.where.name);
  if (!category) return false;
  return category;
};

const mockFindAndCountAll = (Instance, data) => {
  const count = Instance.reduce((acc, category) => {
    if (data.where.id.includes(category.id)) return acc += 1;
  }, 0);
  return ({ count });
}


module.exports = {
  create: async (data) => mockCreate(Categories, data),
  findAll: async () => Categories,
  findOne: async (data) => mockFindOne(Categories, data),
  findAndCountAll: async (ids) => mockFindAndCountAll(Categories, ids),
};