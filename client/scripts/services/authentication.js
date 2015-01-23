"use strict";

angular.module('ibookApp')
    .service('AuthenticationService', function ($cookieStore) {
        return {
            isLogined: function () {
                var userInfo = $cookieStore.get('_i_user');

                if (userInfo === undefined) {
                    return false;
                }

                return true;
            }
        }
    });
