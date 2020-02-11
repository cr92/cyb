'use strict';
const dotenv = require('dotenv');
dotenv.config();
const supertest = require('supertest');
const request = supertest(`localhost:${process.env.APP_PORT}/api`);

//create 4 items
const itemsList = [{
    name: 'A',
    price: 30
}, {
    name: 'B',
    price: 20
}, {
    name: 'C',
    price: 50
}, {
    name: 'D',
    price: 15
}];

// create cart discount rule
const cartDiscountRule = {
    ruleName: 'cart150',
    discountAmount: 20,
    minCartValue: 150
};

// create item discount rules
const itemDiscountRuleList = [{
    ruleName: 'multi3',
    discountAmount: 15,
    multipleOf: 3,
    appliesToIndex: [0]
}, {
    ruleName: 'multi2',
    discountAmount: 5,
    multipleOf: 2,
    appliesToIndex: [1]
}];

(async () => {
    let res = await Promise.all(itemsList.map(item => request.post('/items').send(item)));
    let itemIds = res.map(each => each.body._id);
    
    await request.post('/cart-discount').send(cartDiscountRule);
    
    for (let i = 0; i < itemDiscountRuleList.length; i++) {
        itemDiscountRuleList[i].appliesTo = itemDiscountRuleList[i].appliesToIndex.map(index => itemIds[index]);
        delete itemDiscountRuleList[i].appliesToIndex;
    }
    await Promise.all(itemDiscountRuleList.map(idr => request.post('/item-discount').send(idr)));
})();