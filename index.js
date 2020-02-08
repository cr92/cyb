'use strict';

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app/app.js');

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log('Port: ', PORT);
});