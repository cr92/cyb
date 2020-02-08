'use strict';

const cartController = require('./controller.js');

module.exports = function (app) {
    app.get('/about', cartController.getAbout);
}