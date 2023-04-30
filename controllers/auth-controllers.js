const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const { controllerWrapper } = require("../utils");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const { nanoid } = require("nanoid")

const { User } = require('../models/user');

const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const result = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription
        }
    })

}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw new HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(400, "missing required field email")
    }
    if (user.verify) {
        throw new HttpError(400, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target = "_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`
    };
    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, "Email or password is wrong")
    }

    if (!user.verify) {
        throw new HttpError(401, "Email not verify")
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

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;

    const avatarName = `${_id}_${filename}`;
    const resoltUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resoltUpload);
    const avatarURL = path.join("avatars", avatarName);

    const image = await Jimp.read(resoltUpload);
    await image.resize(250, 250);
    await image.writeAsync(resoltUpload);

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL })
}


module.exports = {
    register: controllerWrapper(register),
    login: controllerWrapper(login),
    getCurrent: controllerWrapper(getCurrent),
    logout: controllerWrapper(logout),
    updateUserSubscription: controllerWrapper(updateUserSubscription),
    updateAvatar: controllerWrapper(updateAvatar),
    verify: controllerWrapper(verify),
    resendVerifyEmail: controllerWrapper(resendVerifyEmail),
}