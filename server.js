"use strict";

var express = require('express'),
    bootstrap = require('./server/lib/bootstrap');

var app = express();

app.use(bootstrap());

var port = process.env.PORT || 8080;

app.listen(port, '0.0.0.0', function () {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
    console.log('Application ready to serve requests.');
});