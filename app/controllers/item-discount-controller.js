'use strict';

const itemDiscount = require('../models/item-discount.js');
const item=require('../models/item.js');

module.exports = {

    addItemDiscount: async (req, res, next) => {
        const itemDiscountInfo = req.body;
        const reqItemsList = itemDiscountInfo.appliesTo || [];
        let validItemsList = [];
        try {
            validItemsList = (await Promise.all(reqItemsList.map(itemId => item.findById(itemId)))).filter(Boolean);
        } catch (e) {
            return next(e);
        }

        if (validItemsList.length !== reqItemsList.length) {
            return next(new Error('Cannot apply discount on invalid items'))
        }

        itemDiscount.create(itemDiscountInfo)
            .then((data) => res.send(data))
            .catch(next);
    }
}