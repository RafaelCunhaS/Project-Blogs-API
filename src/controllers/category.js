const categoryService = require('../services/category');
const { OK_STATUS, CREATED } = require('../utils/statusCode');

const getAll = async (_req, res) => {
  const categories = await categoryService.getAll();

  return res.status(OK_STATUS).json(categories);
};

const create = async (req, res) => {
  const { name } = req.body;

  const id = await categoryService.create(name);

  return res.status(CREATED).json({ id, name });
};

module.exports = {
  create,
  getAll,
};