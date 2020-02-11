'use strict';

const item = require('../models/item');
const cart = require('../models/cart');

module.exports = {

    createCart: (req, res, next) => {
        const itemId = req.body.itemId;
        item.findById(itemId)
            .then((itemInfo) => {
                if (itemInfo) {
                    const c = new cart();
                    c.items.push(itemInfo);
                    return c.save();
                }
                throw new Error('Invalid item cannot be added');
            })
            .then((doc) => {
                res.send(doc);
            })
            .catch(next)
    },

    addToCart: async (req, res, next) => {
        const cartId = req.body.cartId;
        const itemId = req.body.itemId;
        const itemInfo = await item.findById(itemId);
        if (!itemInfo) {
            next(new Error('Invalid item cannot be added'));
        }
        cart.findOneAndUpdate({
                _id: cartId
            }, {
                $push: {
                    items: itemInfo
                }
            }, {
                new: true
            })
            .then((result) => {
                if (!result) {
                    throw new Error('Cannot add items to invalid Cart')
                }
                res.send(result);
            })
            .catch(next)
    }
}