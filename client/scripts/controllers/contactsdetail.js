'use strict';

angular.module('ibookApp')
    .controller('ContactsDetailCtrl', function ($rootScope, $http, $scope, $stateParams) {

        var id = $stateParams.id;

        $http.get('/api/contacts/' + id).success(function (result) {
            $scope.contact = result.data;

            var itemId = result.data._id;

            $http.get('/api/contacts/' + itemId + '/groups').success(function (result) {
                $scope.groups = result.data;
            });
        });

    });
