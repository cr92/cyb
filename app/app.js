'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes/route.js');
const handleErrors = require('./middlewares/error-handler');

const app = express();

app.use(cors())
app.use(bodyParser.json());

routes(app);

app.use(handleErrors);

module.exports = app;