'use strict';

const item = require('../models/item');
const cart = require('../models/cart');

module.exports = {

    createCart: (req, res, next) => {
        const itemId = req.body.itemId;
        item.findById(itemId)
            .then((itemInfo) => {
                const c = new cart();
                c.items.push(itemInfo);
                return c.save()
            })
            .then((d) => {
                res.send(d);
            })
            .catch(next)
    },

    addToCart: async (req, res, next) => {
        const cartId = req.body.cartId;
        const itemId = req.body.itemId;
        const itemInfo = await item.findById(itemId);
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
                res.send(result);
            })
            .catch(next)
    }

    

}