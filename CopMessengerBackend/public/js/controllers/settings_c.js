myAppControllers.controller('SettingsCntrl', ['$scope', '$location', '$rootScope', 'Data', '$route', function($scope, $location, $rootScope, Data, $route) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
	$scope.msg                  	= "";
	$rootScope.$broadcast('BrowserRefreshed', "SETTINGS");
	
        $scope.refreshSettingsPage	= function() {
		
        };
        
	$scope.refreshSettingsPage();
	
	$scope.doManageRecord			= function() {
		
	};
	
	$scope.clearThisForm			= function() {
		$scope.msg                  	= "";
		$scope.CurFrm.$setPristine();
		return false;
	};
}]);