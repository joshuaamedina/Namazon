const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        cart: {
            type: mongoose.ObjectId,
            ref: 'cart'
        },

    })

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;