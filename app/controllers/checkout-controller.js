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
    let decoFuncs = cartDiscountRules.map(rule => interpretCartDiscountRule(rule));
    // not using discount composition, just applying various active rules
    // and return sorted in descending discounts
    return (decoFuncs.map(func => func(itemDiscountedCart))).sort((a, b) => a.postCartDiscountBill < b.postCartDiscountBill);
}

// designed to handle composition of cart discount rules f(g(h(cart)))
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

const calculateItemDiscount = async (noDiscountCart) => {
    let postItemDiscountCart = {
        preCartDiscountBill: 0
    };
    let itemDiscountInfo = await itemDiscount.find({
        isActive: true
    });

    let uniqs = _.groupBy(noDiscountCart.items, '_id');
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
        postItemDiscountCart[key] = d
        postItemDiscountCart.preCartDiscountBill = postItemDiscountCart.preCartDiscountBill + d.finalItemPrice;
    }
    return postItemDiscountCart;

}

const interpretItemDiscountRule = (itemDiscountRule) => {
    let {
        ruleType,
        discountType,
        discountAmount,
        multipleOf
    } = itemDiscountRule;
    if (ruleType == 'MULTIPLE') {
        if (discountType == 'FLAT') {

        }
    }
}

const calculateCart = async (req, res, next) => {
    const {
        cartId
    } = req.body;
    const noDiscountCart = await cart.findById(cartId);
    if (!noDiscountCart) {
        return next(new Error('Invalid cart cannot be checked out'));
    }
    if (noDiscountCart.items.length === 0) {
        return next(new Error('Cannot check out empty cart'));
    }
    const postItemDiscountCart = await calculateItemDiscount(noDiscountCart);
    const postCartDiscountCart = (await calculateCartDiscount(postItemDiscountCart))[0]; //apply max discount
    res.send(postCartDiscountCart);
}


module.exports = {
    calculateCart
}