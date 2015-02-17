"use strict";

var _ = require('lodash');
var S = require('string');
var moment = require('moment');
var uuid = require('node-uuid');
var async = require('async');

var client = require('../../services/elasticsearch');
var tools = require('../../lib/utils');
var xbzContactsType = tools.xbzContactsType;
var datetimeFormat = tools.datetimeFormat;

var BaseController = require('../../lib/baseController');
var owner = BaseController.ownerHandler;
var error4response = BaseController.response4error;

/**
 * 小本子 组
 * @type {string}
 */
var typeName = 'xbz_contacts_group';
var type4relation = 'xbz_contacts_relation';


/**
 * 小本子 组 controller
 * @param router
 */
module.exports = function (router) {


    router.all('*', function (req, res, next) {
        req.user = {
            store_id: 79,
            id: 200
        };

        next();
    });


    /**
     * 截取id
     */
    router.param('id', function (req, res, next, id) {

        var body = {
            query: {
                bool: {
                    must: [
                        { term: {'_id': id }}
                    ],
                    should: [
                        { term: {'type': 'enterprise' }},
                        { term: {'user_id': req.user['id'] }}
                    ],
                    "minimum_should_match": 1
                }
            },
            from: req.query.from || 0,
            size: req.query.size || 200,
            sort: req.query.sort || []
        };

        client.search({
            index: client.indexName,
            type: typeName,
            body: body
        }, function (err, result) {

            if (err) {

                return next(err);
                //return res.json({status: 500, message: err.message});
            }

            var data = _.first(_.map(result.hits.hits, function (item) {
                var result = item._source;
                result._id = item._id;
                return result;
            }));

            if (!data) {

                return next(new Error('failed to load contacts(' + id.toString() + ').'));
            }

            console.log(data);

            /**
             * 小本子 业务对象 contactGroup
             */
            req.xbzContactGroup = data;

            next();
        });
    });


    /**
     * 根据门店和用户Id获取分组列表
     * /api/groups
     */
    router.get('/', function (req, res) {
        var body = {
            query: {
                bool: {
//                    must: [
//                        { term: {'type': 'enterprise' }}
//                    ],
//                    should: [
//
//                    ]

                }
            },
            from: req.query.from || 0,
            size: req.query.size || 100,
            sort: [
                {sort_order: 'desc'}
            ]
        };

        if (req.query.type) {
            body.query.bool.must = [
                { term: {'type': xbzContactsType.Customer }},
                { term: {'user_id': req.user['id'] }}
            ];
        } else {
            body.query.bool.should = [
                { term: {'type': 'enterprise' }},
                { term: {'user_id': req.user['id'] }}
            ];
        }


        client.search({
            index: client.indexName,
            type: typeName,
            body: body
        }, function (err, result) {

            if (err) {
                console.log(err);
                return res.status(500).json({status: 500, message: err.message});
            }

            var items = _.map(result.hits.hits, function (item) {
                var result = item._source;
                result._id = item._id;
                return result;
            });

            var groupIds = _.map(items, function (item) {

                return {term: {
                    'xbz_contacts_group_id': item._id
                }};

            });

            client.search({
                index: client.indexName,
                type: 'xbz_contacts_relation',
                body: {
                    query: {
                        bool: {
                            should: groupIds
                        }
                    },
                    facets: {
                        "group": {
                            terms: {
                                "field": "xbz_contacts_group_id"
                            }
                        }
                    },
                    from: 0,
                    size: 0
                }
            }, function (err, groupCountResult) {

                var map = {};
                _.forEach(groupCountResult.facets.group.terms, function (item) {
                    map[item.term] = item.count;
                });

                _.forEach(items, function (item) {
                    item.count = map[item._id];
                });

                res.json({status: 200, data: items});
            });
        });
    });


    router.get('/:id', function (req, res) {
        var body = {
            query: {
                bool: {
                    must: [
                        { has_child: {type: 'xbz_contacts_relation', term: {'xbz_contacts_group_id': req.query.id} }},
                        { term: {'user_id': req.user['id'] }}
                    ],
                    should: [
                        { term: {'store_id': req.user['store_id'] }},
                        { term: {'user_id': req.user['id'] }}
                    ],
                    "minimum_should_match": 1}
            },
            from: req.query.from || 0,
            size: req.query.size || 200,
            sort: req.query.sort || []
        };

        client.search({
            index: client.indexName,
            type: typeName,
            body: body
        }, function (err, result) {

            if (err) {
                console.log(err);
                return res.status(500).json({status: 500, message: err.message});
            }

            var data = _.first(_.map(result.hits.hits, function (item) {
                var result = item._source;
                result._id = item._id;
                return result;
            }));

            res.json({status: 200, data: data});
        });
    });


    router.post('/', function (req, res) {
        var body = req.body || {};

        body['user_id'] = req.user.id;
        body['type'] = xbzContactsType.Customer;

        //default
        body['created_date'] = body['updated_date'] = moment().format(datetimeFormat);
        // = moment().format(datetimeFormat);

        var doc = {
            index: client.indexName,
            type: typeName,
            id: uuid.v1(),
            body: body
        };

        // console.log(doc);
        client.index(doc, function (err, rst) {

            if (err) {
                console.log(err);

                return error4response(err, res);
            }

            //console.log(rst);
//            { _index: 'intime',
//                _type: 'xbz_contacts',
//                _id: '08190740-b349-11e4-8a5e-0b8cc8b50d27',
//                _version: 1,
//                created: true }

            body._id = rst._id;
            res.status(201);

            console.log(body);
            res.json({status: 201, data: body});
        });
    });


    router.put('/:id', [owner({modelKey: 'xbzContactGroup'})], function (req, res) {
        var id = req.params.id;
        var group = req.xbzContactGroup;
        var body = req.body || {};

        body['user_id'] = req.user.id;
        body['type'] = xbzContactsType.Customer;

        body['updated_date'] = new moment().format(datetimeFormat);
        body['created_date'] = group.created_date || new moment().format(datetimeFormat);

        var doc = {
            index: client.indexName,
            type: typeName,
            id: id,
            body: body
        };

        client.index(doc, function (err, rst) {
            if (err) {
                return error4response(err, res);
            }

            body._id = rst._id;
            res.status(201);
            res.json({status: 201, data: body});
        });
    });


    router.delete('/:id', [owner({modelKey: 'xbzContactGroup'})], function (req, res) {
        var id = req.params.id;

        //需要先验证下 当前的TYPE 是否时 CUSTOMEER，只有这个TYPE的可以被删除。

        var opts = {
            index: client.indexName,
            type: typeName,
            id: id
        };

        //console.log(opts);

        //delete guanxi
        var relationOpts = {
            index: client.indexName,
            type: type4relation,
            body: {
                query: {
                    bool: {
                        must: [
                            { term: {'xbz_contacts_group_id': id }} //,
                            // { term: {'user_id': user.id}},
                            // { term: {'type': xbzContactsType.Customer}}
                        ]
                    }
                }
            }
        };

        /**
         * del relation
         * @param cb
         */
        var fn2 = function (cb) {
            //console.log(relationOpts) ;
            client.deleteByQuery(relationOpts, function (err, rst) {
                if (err) {
                    return cb(err);
                }
                cb(null, rst);
            });
        };

        var fn1 = function (cb) {
            client.delete(opts, function (err, rst) {
                if (err) {
                    return cb(err);
                }

                cb(null, rst);
            });
        };

        async.series({ delGroup: fn1, delRelation: fn2}, function (err, rst) {
            if (err) {
                console.log(err);

                return error4response(err, res);
            } else {

                //console.log(JSON.stringify( rst));
                res.status(204);
                res.json({status: 204});
            }
        });
    });
};


