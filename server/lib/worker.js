"use strict";

var bus = require('li-bus'),
    glob = require('glob'),
    path = require('path');

module.exports = function (app, config) {

    var baseDir = path.resolve('server/workers');

    glob.sync('**/*.js', {cwd: baseDir, mark: true}).forEach(function (name) {
        require(path.join(baseDir, name))(bus, app, config);
    });
};