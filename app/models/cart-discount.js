const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
    BULK,
    FLAT
} = require('../const.js');

const cartDiscountSchema = new Schema({
    ruleName: {
        type: String,
        required: true
    },
    ruleType: {
        type: String,
        enum: [BULK],
        default: BULK
    },
    discountType: {
        type: String,
        enum: [FLAT],
        default: FLAT
    },
    discountAmount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    minCartValue: {
        type: Number,
        required: true
    }
});

const cartDiscount = mongoose.model('cartDiscount', cartDiscountSchema);

module.exports = cartDiscount;