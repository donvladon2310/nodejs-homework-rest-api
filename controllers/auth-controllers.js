const bcrypt = require("bcryptjs");

const { controllerWrapper } = require("../utils");
const jwt = require("jsonwebtoken");

const { User } = require('../models/user');

const HttpError = require("../helpers/HttpError");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        user: {
            email: result.email,
            subscription: "starter"
        }
    })

}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, "Email or password is wrong")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw new HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id,
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });


    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "logout success"
    })
}

const updateUserSubscription = async (req, res) => {
    const { subscription } = req.body;
    const { _id } = req.user;

    if (!['starter', 'pro', 'business'].includes(subscription)) {
        return res.status(400).json({ message: 'Invalid subscription type' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            _id,
            { subscription },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update subscription' });
    }
};

module.exports = {
    register: controllerWrapper(register),
    login: controllerWrapper(login),
    getCurrent: controllerWrapper(getCurrent),
    logout: controllerWrapper(logout),
    updateUserSubscription: controllerWrapper(updateUserSubscription),
}