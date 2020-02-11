'use strict';

const item = require('../models/item');
const cart = require('../models/cart');
const cartDiscount = require('../models/cart-discount');
const itemDiscount = require('../models/item-discount');
const _ = require('lodash');
const {
    BULK,
    FLAT,
    MULTIPLE
} = require('../const.js');

const calculateCartDiscount = async (itemDiscountedCart) => {
    let cartDiscountRules = await cartDiscount.find({
        isActive: true
    });
    let decoFuncs = cartDiscountRules.map(rule => interpretCartDiscountRule(rule));
    // not using discount composition, just applying various active rules
    // and return the cart with maximum discount
    return ((decoFuncs.map(func => func(itemDiscountedCart))).sort((a, b) => a.postCartDiscountBill < b.postCartDiscountBill))[0];
}

// designed to handle composition of cart discount rules f(g(h(cart)))
const interpretCartDiscountRule = (cartDiscountRule) => {
    let {
        ruleType,
        discountType,
        discountAmount,
        minCartValue
    } = cartDiscountRule;
    if (ruleType === BULK) {
        if (discountType === FLAT) {
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

    let cartProps = _.groupBy(noDiscountCart.items, '_id');
    for (let key in cartProps) {
        let d = {};
        d.itemProps = cartProps[key][0];
        d.count = (cartProps[key]).length;
        d.totalItemPrice = d.count * d.itemProps.price;
        d.discountRules = itemDiscountInfo.filter((each) => each.appliesTo.indexOf(key) > -1)
        let discountFuncs = d.discountRules.map((rule) => interpretItemDiscountRule(rule))
        d.discounts = discountFuncs.map(func => func(d));
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
    if (ruleType === MULTIPLE) {
        if (discountType === FLAT) {
            return (obj) => {
                const bunches = parseInt(obj.count / multipleOf);
                return bunches * discountAmount;
            }
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
    const postCartDiscountCart = (await calculateCartDiscount(postItemDiscountCart));
    res.send(postCartDiscountCart);
}


module.exports = {
    calculateCart
}