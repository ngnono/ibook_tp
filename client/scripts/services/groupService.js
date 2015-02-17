/**
 * User: ngnono
 * Date: 15-2-16
 * Time: 下午11:08
 * To change this template use File | Settings | File Templates.
 */

'use strict';


angular.module('ibookApp')
    .service('GroupService', ['$http,$ionicPopup,$scope,$ionicLoading', function ($http, $ionicPopup, $scope, $ionicLoading) {
        return {
            /**
             * 保存
             * @param obj  obj.group
             */
            save: function (obj) {
                var group = obj.group;
                var id = group._id;

                $http.put('/api/groups/' + id, group)
                    .success(function (data, status, headers, config) {
                        $scope.saveDisabled4groupedit = false;
                        if (data.status < 200 || data.status >= 300) {
                            $ionicPopup.alert({
                                title: '异常',
                                template: 'error code:' + data.status + ', message:' + data.message
                            });
                        }

                        //close
                        $scope.closeModal4groupedit();
                    })
                    .error(function (data, status, headers, config) {
                        $scope.saveDisabled4groupedit = false;

                        var alertPopup = $ionicPopup.alert({
                            title: '异常',
                            template: 'error code:' + data.status + ', message:' + data.message
                        });
                        alertPopup.then(function (res) {
                            //console.log('Thank you for not eating my delicious ice cream cone');
                        });
                    });
            },

            /**
             * del
             * @param obj   obj.group
             */
            del: function (obj) {
                var group = obj.group;
                $http.delete('api/groups/' + group._id)
                    .success(function (data, status, headers, config) {

                        if (status >= 200 && status < 300) {
                            //需要删除 groups
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: '错误',
                                template: 'code:' + data.status + ',message:' + data.message
                            });
                            alertPopup.then(function (res) {
                                //console.log('Thank you for not eating my delicious ice cream cone');
                            });
                        }
                    })
                    .error(function (data, status, headers, config) {

                        var alertPopup = $ionicPopup.alert({
                            title: '删除分组发生异常',
                            template: 'code:' + status + ',data:' + data
                        });
                        alertPopup.then(function (res) {
                            //console.log('Thank you for not eating my delicious ice cream cone');
                        });
                    });
            },

            /**
             * 添加
             * @param obj obj.group
             */
            add: function (obj) {
                var group = obj.group;
                $http.post('/api/groups', group)
                    .success(function (data, status, headers, config) {
                        $scope.saveDisabled4group = false;
                        if (data.status >= 200 && data.status < 300) {
                            $scope.groups.push(data.data);
                        } else {
                            $ionicPopup.alert({
                                title: '异常',
                                template: 'error code:' + data.status + ', message:' + data.message
                            });
                        }

                        //close
                        $scope.closeModal4group();
                    })
                    .error(function (data, status, headers, config) {
                        $scope.saveDisabled4group = false;

                        var alertPopup = $ionicPopup.alert({
                            title: '异常',
                            template: 'error code:' + data.status + ', message:' + data.message
                        });
                        alertPopup.then(function (res) {
                            //console.log('Thank you for not eating my delicious ice cream cone');
                        });
                    });
            },

            /**
             * get
             * @param obj
             */
            get: function (obj) {
                var group = obj.group;
                var id = group._id;
                $http.get('/api/groups/' + id)
                    .success(function (result) {
                        return result.data;
                    })
                    .error(function () {
                        $ionicLoading.show({
                            template: '网络异常',
                            noBackdrop: true,
                            duration: 3000
                        });

                        return {};
                    });
            },

            /**
             * 获取列表
             * @param obj
             */
            getList: function (obj) {
                $http.get('/api/groups')
                    .success(function (result) {
                        return result.data;
                    })
                    .error(function () {
                        $ionicLoading.show({
                            template: '网络异常',
                            noBackdrop: true,
                            duration: 3000
                        });

                        return [];
                    });
            }
        }
    }]);
