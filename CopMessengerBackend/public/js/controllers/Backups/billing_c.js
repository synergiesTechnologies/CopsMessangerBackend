myAppControllers.controller('BillingCntrl', ['$scope', '$location', '$rootScope', 'Data', 'UserService', function($scope, $location, $rootScope, Data, UserService) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;
        $scope.records              = [];
        $scope.msg                  = "";
        $scope.pageSize             = 100;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
        
        $rootScope.$broadcast('BrowserRefreshed', "BILL");
        
        $scope.refreshSalesBillList         = function () {
            $scope.promise                  = Data.get('BillingCtrl/records').then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.records;
                }
            });
        };
        
        $scope.refreshSalesBillList();
	
	$scope.addNewBill           		= function(){
            UserService.selectedSaleBill 	= null;
            $location.path("/managebill");
        };
	
	$scope.previewBillRecord          	= function(selRecord){
            UserService.selectedSaleBill	= selRecord;
            $location.path("/viewbill");
        };
    }
]);