const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        Items: [{
            type: mongoose.ObjectId,
            ref: 'cartItem'
        }]
    })

const CartModel = mongoose.model('cart', cartSchema);

module.exports = CartModel;
