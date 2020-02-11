'use strict';

const itemController = require('../controllers/item-controller.js');
const cartController = require('../controllers/cart-controller.js');
const itemDiscountController = require('../controllers/item-discount-controller');
const cartDiscountController = require('../controllers/cart-discount-controller');
const checkoutController = require('../controllers/checkout-controller');

const rv = require('../middlewares/req-validator');

module.exports = function (app) {
    app.post('/api/items', [rv.addItemReqValidator], itemController.addItem);
    app.get('/api/items', itemController.getAllItems);
    app.post('/api/cart', [rv.createCartReqValidator], cartController.createCart);
    app.put('/api/cart', [rv.addToCartReqValidator], cartController.addToCart);
    app.post('/api/item-discount', [], itemDiscountController.addItemDiscount);
    app.post('/api/cart-discount', [], cartDiscountController.addCartDiscount);
    app.post('/api/checkout', [rv.calculateCartReqValidator], checkoutController.calculateCart);
}