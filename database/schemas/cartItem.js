const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
    {
        storeItemId: {
            type: mongoose.ObjectId,
            ref: 'storeItem'
        },
        quantity: Number,

    })

const CartItemModel = mongoose.model('cartItem', cartItemSchema);

module.exports = CartItemModel;