/**
 * User: ngnono
 * Date: 15-2-11
 * Time: 下午2:44
 * To change this template use File | Settings | File Templates.
 */

'use strict';


var _ = require('lodash');
var S = require('string');


var xbzContactsType = require('../../lib/utils').xbzContactsType;

/**
 * 小本子 个人 资源
 * @type {string}
 */
var typeName = 'xbz_personal_resources';
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
                        //{ term: {'store_id': req.user['store_id'] }},
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

                return next(err);
                //return res.json({status: 500, message: err.message});
            }

            var data = _.first(_.map(result.hits.hits, function (item) {
                var result = item._source;
                result._id = item._id;

                return result;
            }));

            if (data.length === 0) {

                return next(new Error('failed to load resource(' + id.toString() + ').'));
            }

            /**
             * 小本子 业务对象 contacts
             */
            req.resource = data[0];

            next();
        });
    });


    router.get('/:id', function (req, res) {

    });


    router.get('/', [owner({})], function (req, res) {

    });


    router.post('/', function (req, res) {
    });


    router.put('/:id', [owner({})], function (req, res) {
    });


    router.delete('/:id', [owner({})], function (req, res) {
    });


    /**
     * owner
     * @param opts
     * @returns {_owner}
     */
    function owner(opts) {

        opts = opts || {};

        var key = opts.key || 'id';
        var userKey = opts.userKey || 'user';
        var type = xbzContactsType.Customer;

        /**
         * 自己的
         */
        var _owner = function (req, res, next) {

            var id = req.params[key];
            var user = req[userKey];
            var model = req.resource;

            if (!model) {
                res.status(404);
                res.json({status: 404, message: 'not found for id:' + id});

                return;
            }

            if (model.user_id !== user.id) {
                res.status(400);
                res.json({status: 400, message: 'the resource is not your。'});

                return;
            }

            var ms = ['POST', 'PUT', 'DELETE'];

            if (_.include(ms, req.method)) {
                if (model.type !== type) {
                    res.status(400);
                    res.json({status: 400, message: S('resource cannot be {{method}}, because resource.type is {{type}}."').template({method: req.method, type: model.type}).s });

                    return;
                }
            }

            next();
        };

        return _owner;
    }
};