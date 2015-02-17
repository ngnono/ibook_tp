"use strict";

var Client = require('li-ims-client');
var config = require('config');

var routes = {
    'customer.outSiteLogin': {
        uri: '/customer/outsitelogin',
        method: 'POST'
    },
    'customer.portrait': {
        uri: '/customer/portrait',
        method: 'POST'
    }
};

var client = new Client(config.get('ims'), routes);

/**
 * Export client
 * @type {ImsClient}
 */
module.exports = client;