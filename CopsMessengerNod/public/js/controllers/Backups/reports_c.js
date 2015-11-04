myAppControllers.controller('ReportsCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;        
        $scope.records              = []; // all mappings
        $scope.msg                  = "";
        $scope.pageSize             = 10;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
	$scope.report_types         = [{"id":"1", "name":"Sale"}, {"id":"2", "name":"Purchase"}];
	$scope.bill_types           = [{"id":"Form No. 8", "name":"Form No. 8"}, {"id":"Form No. 8B", "name":"Form No. 8B"}];
	$scope.statusOptions        = [{"id":"Issued", "name":"Issued"}, {"id":"Cancelled", "name":"Cancelled"}, {"id":"Saved", "name":"Saved"}];
        
        $rootScope.$broadcast('BrowserRefreshed', "REPORT");
        
        $scope.refreshReportsOptions        = function () {
            $scope.records                  = [];
            $scope.promise                  = Data.get('MappingsCtrl/records').then(function (results) {
                if (results.code === "SUCCESS") {                
                }
            });
        };
        
        $scope.refreshReportsOptions();
                
        $scope.doManageMapping  = function () {
            
        };
    }
]);