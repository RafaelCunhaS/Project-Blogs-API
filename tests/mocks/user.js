const Users = require('./Users.json');

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
  const user = Instance.find((user) => user.id === Number(id));
  if (!user) return false;
  delete user.password;
  return user;
}

const mockRemove = (Instance, id) => {
  const newData = Instance.filter((user) => user.id !== Number(id.where.id));
  Instance.push(newData);
  return;
}

module.exports = {
  create: async (data) => mockCreate(Users, data),
  findAll: async () => Users,
  findOne: async (data) => mockFindOne(Users, data),
  findById: async (id) => mockFindById(Users, id),
  remove: async (id) => mockRemove(Users, id)
};