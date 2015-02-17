'use strict';

/**
 * IBook module of the application.
 */
angular
    .module('ibookApp', [
        'ngAnimate',
        'ngCookies',
        'ionic'
    ]).config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/contacts');

        /**-------------------------------------------------
         * /contacts
         -------------------------------------------------*/
        $stateProvider.state('contacts', {
            abstract: true,
            url: '/contacts',
            template: '<ion-nav-view></ion-nav-view>'
        });

        // /contacts
        $stateProvider.state('contacts.list', {
            url: '',
            templateUrl: 'views/contacts/contacts.list.html',
            controller: 'ContactsCtrl'
        });


        // contacts/new
        $stateProvider.state('contacts.new', {
            url: '/new',
            templateUrl: 'views/contacts/contacts.new.html',
            controller: 'ContactsNewCtrl'
        });


        // contacts/:id
        $stateProvider.state('contacts.detail', {
            url: '/:id',
            templateUrl: 'views/contacts/contacts.detail.html',
            controller: 'ContactsDetailCtrl'
        });


        // contacts/:id/edit
        $stateProvider.state('contacts.edit', {
            url: '/:id/edit',
            templateUrl: 'views/contacts/contacts.edit.modal.html',
            controller: 'ContactsEditCtrl'
        });


        /**-------------------------------------------------
         * /groups
         -------------------------------------------------*/
        $stateProvider.state('groups', {
            abstract: true,
            url: '/groups',
            template: '<ion-nav-view></ion-nav-view>'
        });

        // groups
        $stateProvider.state('groups.list', {
            url: '',
            templateUrl: 'views/contacts/groups.list.html',
            controller: 'GroupsCtrl'
        });

        //groups/:id
        $stateProvider.state('groups.detail', {
            url: '/:groupId',
            templateUrl: 'views/contacts/contacts.list.html',
            controller: 'ContactsCtrl'
        });
    })
    .run(function ($rootScope, $state, $ionicPlatform, $stateParams, $ionicLoading, $ionicHistory, AuthenticationService) {

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.goBack = function () {
            $ionicHistory.goBack();
        };

        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({
                template: 'Loading...'
            });
        });

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        });

        /**
         * 校验微信登陆信息
         */
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {

            if (!AuthenticationService.isLogined()) {
                //location.href='/auth/wechat';
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {

            if ($state.current.name.indexOf('detail') !== -1) {
                $rootScope.showBackButton = true;
            } else {
                $rootScope.showBackButton = false;
            }
        });
    });

// .run(function ($rootScope, $ionicModal, $http) {
//
//        /**
//         * Search Contacts Common
//         */
//        $ionicModal.fromTemplateUrl('views/contacts/_search.html', {
//            scope: $rootScope,
//            focusFirstInput: true,
//            animation: 'slide-in-up'
//        }).then(function (modal) {
//            $rootScope.modal = modal;
//        });
//
//        //Cleanup the modal when we're done with it!
//        $rootScope.$on('$destroy', function () {
//            $rootScope.modal.remove();
//        });
//    });
