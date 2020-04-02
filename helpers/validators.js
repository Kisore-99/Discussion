const Joi = require("@hapi/joi");

const loginValidation = userData => {
  const schema = Joi.object().keys({
    workspaceName: Joi.string().required(),
    emailId: Joi.string()
      .email()
      .required()
  });
  return schema.validate(userData);
};
module.exports.loginValidation = loginValidation;
