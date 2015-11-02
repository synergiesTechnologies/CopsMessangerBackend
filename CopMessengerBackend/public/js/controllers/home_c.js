myAppControllers.controller('HomeCntrl', ['$scope', '$location', '$rootScope', 'Data', '$route', 'ngDialog', '$timeout', 'ExchangeRecord', function($scope, $location, $rootScope, Data, $route, ngDialog, $timeout, ExchangeRecord) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
	
	//$rootScope.jsonData 		= '{}';
        //$rootScope.theme 		= 'ngdialog-theme-default';
	
	$scope.records			= [];
	$scope.pageSize             	= 100;
        $scope.filterKey            	= "";
        $scope.currentPage	    	= 1;
	$scope.msg                  	= "";
	$scope.categories		= [{'id':1, 'name':'School'}, {'id':2, 'name':'Jewellery'}, {'id':3, 'name':'Petrol Pump'}, {'id':4, 'name':'Hotel'}];
	
	$rootScope.$broadcast('BrowserRefreshed', "DASHBOARD");
        
        $scope.refreshDashboard	        = function() {
		$scope.records		= [];
	        /* $scope.promise                          = Data.get('StatisticsCtrl/homestats').then(function(results) {
                        
                }); */
		
		$scope.records.push({"date":"24-Sep-2015", "sender":"ABC College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Use of liquor", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"Temp Name College", "receiver":"Kerala Police", "subject":"Misbehaved in class room", "status":"I", "category":$scope.categories[0]});
		$scope.records.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
        };
        
        $scope.refreshDashboard();
        $rootScope.$broadcast('HomeViewLoaded', '');
	
	$scope.viewRecordDetails		= function(selectedRecord) {
		ExchangeRecord.selectedRecord	= selectedRecord;
                ngDialog.open({
                    template		: 'partials/popupMsgDetails.html',
                    className		: 'ngdialog-theme-plain',
                    closeByEscape	: false,
                    controller		: 'PopupMsgDetailsCtrl',
		    overlay		: true,
                    scope		: $scope,
		    cache		: false
                });
	};
	
	$scope.postIncident			= function(){
		ngDialog.open({
                    template		: 'partials/popupPostIncident.html',
                    className		: 'ngdialog-theme-plain',
                    closeByEscape	: false,
                    controller		: 'PopupPostIncidentCtrl',
		    overlay		: true,
                    scope		: $scope,
		    cache		: false
                });
	};
	
	$scope.informParent			= function(){
		ngDialog.open({
                    template		: 'partials/popupInformParents.html',
                    className		: 'ngdialog-theme-plain',
                    closeByEscape	: false,
                    controller		: 'PopupInformParentCtrl',
		    overlay		: true,
                    scope		: $scope,
		    cache		: false
                });
	};
}]);

myAppControllers.controller('PopupMsgDetailsCtrl', ['$scope', 'ngDialog', 'ExchangeRecord', function ($scope, ngDialog, ExchangeRecord) {
	//console.log(ExchangeRecord.selectedRecord);
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

myAppControllers.controller('PopupPostIncidentCtrl', ['$scope', 'ngDialog', 'ExchangeRecord', function ($scope, ngDialog, ExchangeRecord) {
	//console.log(ExchangeRecord.selectedRecord);
	$scope.record		= {};
	$scope.record.image    	= "./img/no_image.jpeg";
	$scope.closeThisDialog 	= function (val) {
		ngDialog.close();
		console.log("bye");
	};
	
	$scope.confirm		= function (val) {
		console.log("hi");
	};
}]);

myAppControllers.controller('PopupInformParentCtrl', ['$scope', 'ngDialog', 'ExchangeRecord', function ($scope, ngDialog, ExchangeRecord) {
	//console.log(ExchangeRecord.selectedRecord);
	$scope.record			= {};
	
	$scope.record.remincidents 	= [];
	$scope.record.remincidents.push({"date":"24-Sep-2015", "sender":"ABC College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
	$scope.record.remincidents.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Use of liquor", "status":"I", "category":$scope.categories[0]});
	$scope.record.remincidents.push({"date":"24-Sep-2015", "sender":"Temp Name College", "receiver":"Kerala Police", "subject":"Misbehaved in class room", "status":"I", "category":$scope.categories[0]});
	$scope.record.remincidents.push({"date":"24-Sep-2015", "sender":"QWERTY College", "receiver":"Kerala Police", "subject":"Student absent today", "status":"I", "category":$scope.categories[0]});
        
	$scope.record.selincidents 	= [];
	$scope.closeThisDialog 		= function (val) {
		ngDialog.close();
		console.log("bye");
	};
	
	$scope.confirm			= function (val) {
		console.log("hi");
	};
	
	$scope.addRecordsToSelectedList = function (){            
            if ($scope.record.remainingincidents == undefined || $scope.record.remainingincidents.length == 0) {
                $scope.msg              = "Please select record from incidents list";
                $scope.msgSpanClass     = "errorSpan";
            } else {
                var recLen              = $scope.record.remainingincidents.length;
                var anObjectRec         = null;
                for (var i = 0; i < recLen; i++){
                    anObjectRec         = $scope.getActualObject($scope.record.remainingincidents[i], $scope.record.remincidents);
                    $scope.record.selincidents.push(anObjectRec);
                    var index 		= $scope.record.remincidents.indexOf(anObjectRec);
                    $scope.record.remincidents.splice(index, 1);
                }
                $scope.record.remainingincidents   = [];
            }
        };
        
        $scope.removeRecordsFromSelectedList = function (){            
            if ($scope.record.selectedincidents == undefined || $scope.record.selectedincidents.length == 0) {
                $scope.msg              = "Please select record from selected incidents list";
                $scope.msgSpanClass     = "errorSpan";
            } else {
                var recLen              = $scope.record.selectedincidents.length;
                var anObjectRec         = null;
                for (var i = 0; i < recLen; i++){
                    anObjectRec         = $scope.getActualObject($scope.record.selectedincidents[i], $scope.record.selincidents);
                    $scope.record.remincidents.push(anObjectRec);
                    var index 		= $scope.record.selincidents.indexOf(anObjectRec);
                    $scope.record.selincidents.splice(index, 1);
                }
                $scope.record.selectedincidents    = [];
            }
        };
	
	$scope.getActualObject      	= function(refObject, objectsArray){
            var anObjectRec             = {};
            var totalRecs               = objectsArray.length;
            if (totalRecs > 0) {
                for (var i = 0; i < totalRecs; i++){
                    anObjectRec         = objectsArray[i];
                    if (anObjectRec.id == refObject.id) {
                        break;
                    }
                }
            }
            
            return anObjectRec;
        };
}]);