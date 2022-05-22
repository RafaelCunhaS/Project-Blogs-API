const Joi = require('joi');
const errorFunction = require('../utils/errorFunction');

const schema = Joi.object({
  name: Joi.string().required(),
});

module.exports = (req, _res, next) => {
  const { error } = schema.validate(req.body);

  if (error) return next(errorFunction(400, error.message));

  return next();
};