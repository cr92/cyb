'use strict';

module.exports = {
    getAbout: function (req, res) {
        res.send({
            'about': 'This is a simple cart'
        })
    }
}