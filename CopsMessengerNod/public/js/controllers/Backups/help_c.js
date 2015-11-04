myAppControllers.controller('HelpCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
	$rootScope.$broadcast('BrowserRefreshed', "HELP");
    }
]);