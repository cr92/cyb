'use strict';

const itemController = require('../controllers/item-controller.js');
const cartController = require('../controllers/cart-controller.js');

const rv=require('../middlewares/req-validator');

module.exports = function (app) {
    app.post('/api/items', [rv.v],itemController.addItem);
    app.get('/api/items', itemController.getAllItems);
    app.post('/api/cart', cartController.createCart);
    app.put('/api/cart', cartController.addToCart);
    // app.post('/api/order', cartController.calcOrder);
}