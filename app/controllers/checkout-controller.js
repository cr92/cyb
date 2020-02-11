'use strict';

const item = require('../models/item');
const cart = require('../models/cart');
const cartDiscount = require('../models/cart-discount');
const itemDiscount = require('../models/item-discount');
const _ = require('lodash');

const calculateCart = async (req, res, next) => {
    const {cartId} = req.body;
    let tmp={finalBill:0};
    let itemDiscountInfo = await itemDiscount.find({isActive: true});
    let cartInfo = await cart.findById(cartId);
    let uniqs = _.groupBy(cartInfo.items, '_id');
    for(let key in uniqs){
        let d = uniqs[key][0];
        d.count=(uniqs[key]).length;
        d.totalPrice=d.count*d.price;
        d.discountRules=itemDiscountInfo.filter((each)=>each.appliesTo.indexOf(key)>-1)
        d.discounts=d.discountRules.map((rule)=>{
            if(rule.ruleType=='MULTIPLE'){
                let bunches=parseInt(d.count/rule.multipleOf);
                return bunches*rule.discountAmount;
            }
        })
        d.finalDiscount=_.max(d.discounts) || 0;
        d.finalPrice=d.totalPrice-d.finalDiscount;
        tmp[key]=d
        tmp.finalBill=tmp.finalBill+d.finalPrice;
    }

    res.send(tmp);
}


module.exports = {
    calculateCart
}


// function multipleTypeDiscount()