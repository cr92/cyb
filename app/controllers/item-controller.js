'use strict';

const item = require('../models/item');

module.exports = {

    addItem: (req, res, next) => {
        const item_info = req.body;
        item.create(item_info)
            .then((item) => res.send(item))
            .catch(next);
    },

    getAllItems: (req, res, next) => {
        item.find({})
            .then((data) => res.send(data))
            .catch(next)
    }

}