const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        description: String,
    })

const StoreModel = mongoose.model('storeItem', storeItemSchema);

module.exports = StoreModel;