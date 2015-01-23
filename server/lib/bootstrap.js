"use strict";

var path = require('path'),
    config = require('config'),
    express = require('express');

module.exports = function () {

    var app = express();

    ['middleware', 'worker'].forEach(function (name) {
        require(path.join(__dirname, name))(app, config);
    });

    return app;
};