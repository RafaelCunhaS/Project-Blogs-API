const Joi = require('joi');
const errorFunction = require('../utils/errorFunction');

const schema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

module.exports = (req, _res, next) => {
  const { error } = schema.validate(req.body);

  if (error) return next(errorFunction(400, 'Some required fields are missing'));

  return next();
};