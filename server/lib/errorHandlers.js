"use strict";

var _ = require('lodash');

exports.fileNotFound = function (template) {
    return function (req, res, next) {


        throw new Error('aaa');
        var model = { url: req.url, statusCode: 404 };
        if (req.xhr) {
            res.send(404, model);
        } else {
            res.status(404);
            res.render(template, model);
        }
    };
};

exports.serverError = function (template, config) {
    return function (error, req, res, next) {

        var model = { url: req.url, err: error, statusCode: 500 };
        if (req.xhr) {
            res.json(model);
        }
        else {
            res.render(template, model);
        }
    };
};