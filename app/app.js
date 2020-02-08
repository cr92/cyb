'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./route.js');
const mw = require('./middleware');

const app = express();

app.use(cors())
app.use(bodyParser.json());

routes(app);

app.use(mw.handleErrors);

module.exports = app;