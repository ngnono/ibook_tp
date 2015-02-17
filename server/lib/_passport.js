"use strict";

var passport = require('passport'),
    WechatStrategy = require('passport-wechat').Strategy,
    UserModel = require('../models/user');

module.exports = function _passport(app, config) {

    var wechatConfig = config.get('wechat');

    passport.use(new WechatStrategy(wechatConfig, function (openid, profile, token, done) {

        /**
         * 根据用户Id获取用户信息
         */
        UserModel.getUserInfoByOuterId(openid)
            .then(function (userInfo) {
                if (userInfo.isSuccessful) {
                    return done(null, userInfo.data);
                } else {
                    return done(userInfo);
                }
            }, function (err) {
                return done(err);
            });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    return app;
};