'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const test = require('ava');
const delay = require('delay');
const supertest = require('supertest');

const app = require('../app/app.js');

const APP_PORT = process.env.APP_PORT;
let request;

test.before(async t => {
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  });

  app.listen(APP_PORT, () => {
    console.log('Port: ', APP_PORT);
  });
  await delay(1000);
  request = supertest(`localhost:${APP_PORT}/api`);
});

test('ABC', async t => {
  const items = await request.get('/items');
  const priceItemMap = items.body.map(item=>{
    return {
      id:item._id,
      price:item.price
    }
  }).sort((a,b)=>a.name>b.name);
  const res=await request.post('/cart').send({itemId:priceItemMap[0].id});
  const cartId=res.body._id;
  await request.put('/cart').send({itemId:priceItemMap[1].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[2].id,cartId});
  const bill=(await request.post('/checkout').send({cartId})).body;
  t.is(bill.postCartDiscountBill,100)
});

test('BABAA', async t => {
  const items = await request.get('/items');
  const priceItemMap = items.body.map(item=>{
    return {
      id:item._id,
      price:item.price
    }
  }).sort((a,b)=>a.name>b.name);
  const res=await request.post('/cart').send({itemId:priceItemMap[1].id});
  const cartId=res.body._id;
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[1].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  const bill=(await request.post('/checkout').send({cartId})).body;
  t.is(bill.postCartDiscountBill,110)
});

test('CBAADAB', async t => {
  const items = await request.get('/items');
  const priceItemMap = items.body.map(item=>{
    return {
      id:item._id,
      price:item.price
    }
  }).sort((a,b)=>a.name>b.name);
  const res=await request.post('/cart').send({itemId:priceItemMap[2].id});
  const cartId=res.body._id;
  await request.put('/cart').send({itemId:priceItemMap[1].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[3].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[1].id,cartId});
  const bill=(await request.post('/checkout').send({cartId})).body;
  t.is(bill.postCartDiscountBill,155)
});

test('CADAA', async t => {
  const items = await request.get('/items');
  const priceItemMap = items.body.map(item=>{
    return {
      id:item._id,
      price:item.price
    }
  }).sort((a,b)=>a.name>b.name);
  const res=await request.post('/cart').send({itemId:priceItemMap[2].id});
  const cartId=res.body._id;
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[3].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  await request.put('/cart').send({itemId:priceItemMap[0].id,cartId});
  const bill=(await request.post('/checkout').send({cartId})).body;
  t.is(bill.postCartDiscountBill,140)
});