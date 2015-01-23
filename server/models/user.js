"use strict";

var ims = require('../services/ims');

module.exports = {
    /**
     * 根据外部id获取用户信息
     * @param id 外部用户Id
     * @param callback
     */
    getUserInfoByOuterId: function (id) {
        return ims.customer.outSiteLogin({
            outsiteuid: id,
            outsitetype: 4
        });
    }
};