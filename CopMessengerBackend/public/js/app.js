'use strict';

/* App Module */
var myApp   = angular.module('myApp', ['ngRoute', 'myAppControllers', 'ngAnimate', 'cgBusy', 'filereader', 'angularUtils.directives.dirPagination', 'ngDialog']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl     : 'partials/login.html'
        }).
        when('/logout', {
            templateUrl     : 'partials/login.html'
        }).
        when('/home', {
            templateUrl     : 'partials/dashboard.html',
            resolve         : {
                checkSession: function(SessionService){
                    return SessionService();
                }
            }
        }).
        when('/users', {
            templateUrl   : 'partials/users.html',
            resolve         : {
                checkSession: function(SessionService){
                    return SessionService();
                }
            }
        }).
        when('/messages', {
          templateUrl   : 'partials/messages.html',
            resolve         : {
                checkSession: function(SessionService){
                    return SessionService();
                }
            }
        }).
        when('/settings', {
          templateUrl   : 'partials/settings.html',
            resolve         : {
                checkSession: function(SessionService){
                    return SessionService();
                }
            }
        }).
        otherwise({
          templateUrl   : 'partials/login.html'
        });
}]).config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]).run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var name        = localStorage.getItem("name");
        if (name == undefined || name == null) {
            $location.path("/login");
        }        
    });
}]).directive('fileModel', ['$parse', 'FileReader', function ($parse, FileReader) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model       = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    FileReader.readAsDataURL(element[0].files[0], scope).
                    then(function (resp) {
                        modelSetter(scope, resp);
                    }, function (err) {
                        console.log(err);
                    });
                });
            });
        }
    };
}]).factory('SessionService',['Data', function(Data) {
    return function(){
        /*Data.get('SessionCtrl/session').then(function (results) {
            if (results.code === "SUCCESS" && results.message === "VALID_SESSION") {
                localStorage.setItem("id", results.data.id);
                localStorage.setItem("name", results.data.name);
                localStorage.setItem("email", results.data.email);
                localStorage.setItem("login_time", results.data.login_time);
            } else {
                localStorage.removeItem("id");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
                localStorage.removeItem("login_time");
                localStorage.clear();
            }
        });*/
    };
}]).factory('ExchangeRecord', function() {
    return {
        selectedRecord: null
    };
});