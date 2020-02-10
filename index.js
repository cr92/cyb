'use strict';

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app/app.js');

const APP_PORT = process.env.APP_PORT;

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.listen(APP_PORT, () => {
  console.log('Port: ', APP_PORT);
});