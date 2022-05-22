const categoryService = require('../services/category');
const { CREATED } = require('../utils/statusCode');

const create = async (req, res) => {
  const { name } = req.body;

  const { id } = await categoryService.create(name);

  return res.status(CREATED).json({ id, name });
};

module.exports = {
  create,
};