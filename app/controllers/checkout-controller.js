'use strict';

const item = require('../models/item');
const cart = require('../models/cart');
const cartDiscount = require('../models/cart-discount');
const itemDiscount = require('../models/item-discount');
const _ = require('lodash');

const calculateCartDiscount = async (itemDiscountedCart) => {
    let cartDiscountRules = await cartDiscount.find({
        isActive: true
    });
    let decoFuncs = cartDiscountRules.map(rule=>interpretCartDiscountRule(rule));
    return decoFuncs.map(func=>func(itemDiscountedCart));
    
}

const interpretCartDiscountRule = (cartDiscountRule) => {
    let {
        ruleType,
        discountType,
        discountAmount,
        minCartValue
    } = cartDiscountRule;
    if (ruleType === 'BULK') {
        if (discountType === 'FLAT') {
            return (obj) => {
                if (obj.postCartDiscountBill) {
                    discountAmount = obj.postCartDiscountBill >= minCartValue ? discountAmount : 0;
                    obj.postCartDiscountBill = obj.postCartDiscountBill - discountAmount;
                } else {
                    discountAmount = obj.preCartDiscountBill >= minCartValue ? discountAmount : 0
                    obj.postCartDiscountBill = obj.preCartDiscountBill - discountAmount;
                }
                return obj;
            }
        }
    }
}

const calculateCart = async (req, res, next) => {
    const {
        cartId
    } = req.body;
    let tmp = {
        preCartDiscountBill: 0
    };
    let itemDiscountInfo = await itemDiscount.find({
        isActive: true
    });
    let cartInfo = await cart.findById(cartId);
    let uniqs = _.groupBy(cartInfo.items, '_id');
    for (let key in uniqs) {
        let d = uniqs[key][0];
        d.count = (uniqs[key]).length;
        d.totalItemPrice = d.count * d.price;
        d.discountRules = itemDiscountInfo.filter((each) => each.appliesTo.indexOf(key) > -1)
        d.discounts = d.discountRules.map((rule) => {
            if (rule.ruleType == 'MULTIPLE') {
                let bunches = parseInt(d.count / rule.multipleOf);
                return bunches * rule.discountAmount;
            }
        })
        d.finalItemDiscount = _.max(d.discounts) || 0;
        d.finalItemPrice = d.totalItemPrice - d.finalItemDiscount;
        tmp[key] = d
        tmp.preCartDiscountBill = tmp.preCartDiscountBill + d.finalItemPrice;
    }
    let f=(await calculateCartDiscount(tmp))[0];
    res.send(f);
}


module.exports = {
    calculateCart
}


// function multipleTypeDiscount()