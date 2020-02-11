const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemDiscountSchema = new Schema({
    ruleName: {
        type: String,
        required: true
    },
    ruleType: {
        type: String,
        enum: ['MULTIPLE'],
        default: 'MULTIPLE'
    },
    multipleOf:{
        type:Number,
        min:2,
        max:5,
        default:2
    },
    appliesTo: [],
    discountType: {
        type: String,
        enum: ['FLAT'],
        default: 'FLAT'
    },
    discountAmount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const itemDiscount = mongoose.model('itemDiscount', itemDiscountSchema);

module.exports = itemDiscount;