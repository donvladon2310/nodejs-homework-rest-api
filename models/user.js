const { Schema, model } = require('mongoose');

const { handelMongooseError } = require("../utils");


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String
    },
    avatarURL: {
        type: String,
    },
}, { versionKey: false, timestamps: true });

userSchema.post("save", handelMongooseError);

const User = model("user", userSchema);

module.exports = {
    User,
}