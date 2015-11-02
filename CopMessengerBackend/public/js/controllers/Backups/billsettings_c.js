/* Controllers Continue...*/

myAppControllers.controller('BillSettingsCntrl', ['$scope', '$location', '$rootScope', '$filter', 'Data', function($scope, $location, $rootScope, $filter, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;
        $scope.records              = [];
        $scope.msg                  = "";
        $scope.fin                  = {};
        $scope.pageSize             = 10;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
        
        $rootScope.$broadcast('BrowserRefreshed', "BILL_SETTINGS");
        
        $scope.refreshBillSettings         = function () {
            $scope.fin                     = {};
            $scope.fin.status              = "A";
            $scope.fin.id                  = "0";
            $scope.promise                 = Data.get('SettingsCtrl/finrecords').then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.data;
                }
            });
        };
        
        $scope.refreshBillSettings();
        
        $scope.doManageFinYear  = function () {
            $scope.delay        = 0;
            $scope.minDuration  = 0;
            $scope.message      = 'Please Wait...';
            $scope.backdrop     = true;
            $scope.promise      = null;
            var input           = {};
            input["name"]       = $scope.fin.name;
            input["start_date"] = $scope.fin.start_date.getTime() / 1000;
            input["end_date"]   = ($scope.fin.end_date.getTime() / 1000) + 86399; //86399 is timestamp for 23hours 59minutes. This is for set end date upto mid night 11:59PM . Else it will be 12:00AM
            input["tax_rate"]   = $scope.fin.tax_rate;
            input["status"]     = $scope.fin.status;
            input["id"]         = $scope.fin.id;
            $scope.promise      = Data.post('SettingsCtrl/manageFin', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been saved";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.fin              = {};
                    $scope.FinYearFrm.$setPristine();
                    $scope.refreshBillSettings();
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.viewAndEditFinRecord     = function(selRecord){
            $scope.fin.name             = selRecord.name;
            $scope.fin.start_date       = new Date(selRecord.start_date);
            $scope.fin.end_date         = new Date(selRecord.end_date);
            $scope.fin.tax_rate         = selRecord.tax_rate;
            $scope.fin.status           = selRecord.status;
            $scope.fin.id		= selRecord.id;
            $scope.msg                  = "";
        }
        
        $scope.doSearchFin      = function () {
            var input           = {};
            input["keyword"]    = $scope.fin.keyword;
            $scope.promise      = Data.post('SettingsCtrl/finrecords', input).then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records     = results.records;
                } else {
                    
                }
            });
        };
        
        $scope.clearThisForm = function(){
	    $scope.fin.name         = "";
            $scope.fin.start_date   = "";
            $scope.fin.end_date     = "";
            $scope.fin.tax_rate     = "";
            $scope.fin.status       = "A";
	    $scope.fin.id           = "0";
            $scope.msg              = "";
            $scope.FinYearFrm.$setPristine();
	    return false;
	};
    }
]);