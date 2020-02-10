const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    items: []
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;