
const { HttpError } = require("../helpers");


const validateBody = addSchema => {
    const func = async (req, res, next) => {
        const { error } = addSchema.validate(req.body);
        if (error) {
            throw new HttpError(400, error.message)
        }
        next()
    }
    return func;
}

module.exports = validateBody;