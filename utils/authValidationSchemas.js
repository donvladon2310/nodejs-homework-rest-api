const Joi = require('joi');

const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
});

const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required().messages({
        "any.required": "Invalid subscription type",
    })
})

const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
};

module.exports = {
    schemas,
}