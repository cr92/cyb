'use strict';

const itemDiscount = require('../models/item-discount.js');

module.exports = {

    addItemDiscount: (req, res, next) => {
        const itemDiscountInfo = req.body;
        itemDiscount.create(itemDiscountInfo)
            .then((data) => res.send(data))
            .catch(next);
    }
}