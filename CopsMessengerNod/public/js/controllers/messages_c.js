myAppControllers.controller('MessageCntrl', ['$scope', '$location', '$rootScope', 'Data', '$route', 'ngDialog', '$timeout', 'ExchangeRecord', function($scope, $location, $rootScope, Data, $route, ngDialog, $timeout, ExchangeRecord) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
	
	//$rootScope.jsonData 		= '{}';
        //$rootScope.theme 		= 'ngdialog-theme-default';
	
	$scope.records			= [];
	$scope.pageSize             	= 10;
        $scope.filterKey            	= "";
        $scope.currentPage	    	= 1;
	$scope.msg                  	= "";
	$scope.categories		= [{'id':1, 'name':'School'}, {'id':2, 'name':'Jewellery'}, {'id':3, 'name':'Petrol Pump'}, {'id':4, 'name':'Hotel'}];
	
	$rootScope.$broadcast('BrowserRefreshed', "MESSAGE");
        
        $scope.refreshMessages	        = function() {
		$scope.records		= [];
	        /* $scope.promise                          = Data.get('StatisticsCtrl/homestats').then(function(results) {
                        
                }); */
		
		$scope.records.push({"date":"24-Sep-2015", "sender":"ABC College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Use of liquor", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"Temp Name College", "receiver":"Kerala Police", "subject":"Misbehaved in class room", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
        };
        
        $scope.refreshMessages();
	
	$scope.viewRecordDetails		= function(selectedRecord) {
		ExchangeRecord.selectedRecord	= selectedRecord;
                ngDialog.open({
                    template		: 'partials/popupMsgDetails.html',
                    className		: 'ngdialog-theme-plain',
                    closeByEscape	: false,
                    controller		: 'PopupModalCtrl',
		    overlay		: true,
                    scope		: $scope,
		    cache		: false
                });
	};
	
	
}]);


myAppControllers.controller('PopupModalCtrl', ['$scope', 'ngDialog', 'ExchangeRecord', function ($scope, ngDialog, ExchangeRecord) {
	console.log(ExchangeRecord.selectedRecord);
	$scope.subject		= ExchangeRecord.selectedRecord.subject;
	$scope.sender		= ExchangeRecord.selectedRecord.sender;
	$scope.receiver		= ExchangeRecord.selectedRecord.receiver;
	$scope.date		= ExchangeRecord.selectedRecord.date;
	$scope.category		= ExchangeRecord.selectedRecord.category.name;
	$scope.details		= "Test data. Please ignore this. Right now all the data are static. Will update once the services are ready.";
	$scope.status		= ExchangeRecord.selectedRecord.status;
	$scope.closeThisDialog 	= function (val) {
		ngDialog.close();
		console.log("bye");
	};
	
	$scope.confirm		= function (val) {
		console.log("hi");
	};
}]);