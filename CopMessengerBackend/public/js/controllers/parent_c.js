'use strict';

/* Controllers */

var myAppControllers    = angular.module('myAppControllers', []);

myAppControllers.controller('ParentCntrl', ['$scope', 'Data', '$location', function($scope, Data, $location) {
        /*Data.get('SessionCtrl/session').then(function(results) {
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
		$location.path("/login");
	    }
	});*/
        
        $scope.showHome  = function(){
            Data.get('SessionCtrl/session').then(function(results) {
                if (results.code === "SUCCESS" && results.message === "VALID_SESSION") {
                    localStorage.setItem("id", results.data.id);
                    localStorage.setItem("name", results.data.name);
                    localStorage.setItem("email", results.data.email);
                    localStorage.setItem("login_time", results.data.login_time);
                    $location.path("/home");
                } else {
                    localStorage.removeItem("id");
                    localStorage.removeItem("name");
                    localStorage.removeItem("email");
                    localStorage.removeItem("login_time");
                    localStorage.clear();
                    $location.path("/login");
                }
            });
        };
    }
]);