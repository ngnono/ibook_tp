'use strict';

angular.module('ibookApp')
    .controller('GroupsCtrl', function ($scope, $http, $ionicModal, $ionicPopup, $ionicLoading, $ionicActionSheet, $stateParams, $timeout) {

        $ionicModal.fromTemplateUrl('views/contacts/groups.new.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal4group = function () {
            $scope.modal.show();
        };
        $scope.closeModal4group = function () {
            $scope.modal.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

        $scope.saveDisabled4group = false;
        $scope.group = {};

        $scope.submit4group = function () {
            $scope.saveDisabled4group = true;

            $http.post('/api/groups', $scope.group)
                .success(function (data, status, headers, config) {
                    $scope.saveDisabled4group = false;

                    $scope.groups.push(data.data);
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
        };

        $http.get('/api/groups')
            .success(function (result) {
                $scope.groups = result.data;
            })
            .error(function () {
                $ionicLoading.show({
                    template: '网络异常',
                    noBackdrop: true,
                    duration: 3000
                });
            });

        /**
         * show del and edit
         */
        $scope.showFooterMenu = function (group) {

            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    {text: '修改'}
                ],
                destructiveText: '删除',
                titleText: '编辑',
                cancelText: '完成',
                cancel: function () {

                    //window.alert('cancel');
                },
                buttonClicked: function (index) {
                   // window.alert(index);
                    if (index === 0) {
                        //edit
                        $scope.openModal4groupedit(group);
                    }

                    return true;
                },
                destructiveButtonClicked: function () {
                    //window.alert('dest' + group.name || group._id);

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

                    return true;
                }
            });

//            $timeout(function () {
//                hideSheet();
//            }, 2000);
        } ;


        /**
         * edit
         */

        $ionicModal.fromTemplateUrl('views/contacts/groups.edit.modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal4edit = modal;
        });

        $scope.openModal4groupedit = function (group) {
            $scope.modal4edit.show();
            $scope.editGroup = group;
        };
        $scope.closeModal4groupedit = function () {
            $scope.modal4edit.hide();
            $scope.editGroup = {};
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal4edit.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });

        $scope.saveDisabled4groupedit = false;
        $scope.editGroup = {};

        $scope.submit4groupEdit = function () {
            $scope.saveDisabled4groupedit = true;

            $http.put('/api/groups/'+$scope.editGroup._id, $scope.editGroup)
                .success(function (data, status, headers, config) {
                    $scope.saveDisabled4groupedit = false;

                    //$scope.groups.push(data.data);
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
        };

    });
