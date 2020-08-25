function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/config/Settings");
    $stateProvider
    //  .state('index', {
    //        url: "/index",
    //        templateUrl: "views/index.html",
    //        controller: 'dashboardCtrl',
    //        data: {
    //            pageTitle: 'Dashboard'
    //      }
    //   })
        .state('config', {
            url: "/config/:path",
            controller: 'configCtrl',
            templateUrl: "views/configini.html",
            data: {pageTitle: 'config'}
        })

        .state('support', {
            url: "/support",
            templateUrl: "views/support.html",
			data: {pageTitle: 'support'}
        })

        .state('computer', {
            url: "/computer",
            controller: 'computerCtrl',
            templateUrl: "views/computer.html",
			data: {pageTitle: 'computer'}
        })

}
angular
    .module('configApp')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
