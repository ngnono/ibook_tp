'use strict';

angular.module('ibookApp')
    .controller('ContactsCtrl', function ($scope, $rootScope, $stateParams, $http, $ionicLoading, $ionicPopup, $timeout) {

        $scope.searchText = '';
        $scope.offset = 0;
        $scope.pageIndex = 0;
        $scope.data = {
            total: 0,
            items: []
        };
        $scope.hasMore = true;

        $scope.clearSearch = function () {
            $scope.setKeyword('');
        };

        $scope.setKeyword = function (keyword) {
            console.log(keyword);
            keyword = keyword.toUpperCase();
            if (keyword !== $scope.searchText) {

                $scope.searchText = keyword;
                $scope.offset = 0;
                $scope.data.total = 0;
                $scope.data.items = [];
                $scope.hasMore = false;//主动加载列表，不实用loadMore
                $scope.load({
                    q: $scope.searchText,
                    group_id: $stateParams.groupId,
                    from: 0,
                    size: 10
                });
            }
        };

        $scope.load = function (params) {
            $http.get('/api/contacts/', {params: params}).success(function (result) {

                $scope.offset = $scope.offset + result.data.items.length;
                $scope.hasMore = $scope.offset < result.data.total;
                $scope.data.items = $scope.data.items.concat(result.data.items);
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }).error(function () {
                $ionicLoading.show({
                    template: '网络异常',
                    noBackdrop: true,
                    duration: 3000
                });
            });

        };

        $scope.loadMore = function () {
            if (!$scope.hasMore) {
                return;
            }

            $scope.load({
                q: $scope.searchText,
                group_id: $stateParams.groupId,
                from: $scope.offset,
                size: 10
            });
        };

        $scope.deleteContact = function (obj) {
            var confirmPopup = $ionicPopup.confirm({
                title: '您确定要删除吗？',
                template: '您确定要删除联系人:' + obj.name || obj.id
            });

            confirmPopup.then(function (res) {
                    if (res) {
                        $http.delete('api/contacts/' + obj.id)
                            .success(function (data, status, headers, config) {

                                if ($scope.data.items) {
//                                    var t = $scope.data.items[obj.$index];
//                                    if (t._id === obj.id) {
                                    $timeout(function () {
                                        delete   $scope.data.items[obj.$index];
                                    });

//                                    }

//                                    var alertPopup = $ionicPopup.alert({
//                                            title: '删错了。。。。',
//                                            template: obj.$index + '' + ' _id:' + t._id
//                                        }
//                                    );
//                                    alertPopup.then(function (res) {
//                                        //console.log('Thank you for not eating my delicious ice cream cone');
//                                    });

                                }


                            }
                        )
                            .
                            error(function (data, status, headers, config) {

                                var alertPopup = $ionicPopup.alert({
                                    title: '删除联系人发生异常',
                                    template: data.message
                                });
                                alertPopup.then(function (res) {
                                    //console.log('Thank you for not eating my delicious ice cream cone');
                                });
                            });


                    }
                    else {
                        // console.log('You are not sure');
                    }
                }
            )
            ;

        };
    }
)
;
