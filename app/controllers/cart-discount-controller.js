'use strict';

const cartDiscount = require('../models/cart-discount');

module.exports = {

    addCartDiscount: (req, res, next) => {
        const cartDscountInfo = req.body;
        cartDiscount.create(cartDscountInfo)
            .then((data) => res.send(data))
            .catch(next);
    }
}