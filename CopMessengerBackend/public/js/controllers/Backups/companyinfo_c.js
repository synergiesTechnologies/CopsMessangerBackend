myAppControllers.controller('CompanyInfoCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                            = 0;
	$scope.minDuration                      = 0;
	$scope.message                          = 'Please Wait...';
	$scope.backdrop                         = true;
	$scope.promise                          = null;
        $scope.companyInfo                      = {};
	
	$rootScope.$broadcast('BrowserRefreshed', "COMPANY");
	
        $scope.promise                          = Data.get('SettingsCtrl/settingsFull').then(function(results) {
            if (results.code === "SUCCESS") {                
                $scope.companyInfo.siteName     = results.data.siteName;
                $scope.companyInfo.name         = results.data.name;
                $scope.companyInfo.email        = results.data.email;
                $scope.companyInfo.address      = results.data.address;
                $scope.companyInfo.city         = results.data.city;
                $scope.companyInfo.state        = results.data.state;
                $scope.companyInfo.pincode      = results.data.pincode;
                $scope.companyInfo.phone        = results.data.phone;
                $scope.companyInfo.mobile       = results.data.mobile;
                $scope.companyInfo.fax          = results.data.fax;
                $scope.companyInfo.tin_number   = results.data.tin_number;
            } else {
                $scope.companyInfo.siteName     = "";
                $scope.companyInfo.name         = "";
                $scope.companyInfo.email        = "";
                $scope.companyInfo.address      = "";
                $scope.companyInfo.city         = "";
                $scope.companyInfo.state        = "";
                $scope.companyInfo.pincode      = "";
                $scope.companyInfo.phone        = "";
                $scope.companyInfo.mobile       = "";
                $scope.companyInfo.fax          = "";
                $scope.companyInfo.tin_number   = "";
            }
        });
        
        $scope.doUpdateSettings     = function () {
            var input               = {};
            input["siteName"]       = $scope.companyInfo.siteName;
            input["name"]           = $scope.companyInfo.name;
            input["email"]          = $scope.companyInfo.email;
            input["address"]        = $scope.companyInfo.address;
            input["city"]           = $scope.companyInfo.city;
            input["state"]          = $scope.companyInfo.state;
            input["pincode"]        = $scope.companyInfo.pincode;
            input["phone"]          = $scope.companyInfo.phone;
            input["mobile"]         = $scope.companyInfo.mobile;
            input["fax"]            = $scope.companyInfo.fax;
            input["tin_number"]     = $scope.companyInfo.tin_number; 
            $scope.promise          = Data.post('SettingsCtrl/update_settings', input).then(function(results) {
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been updated";
                    $scope.msgSpanClass     = "messageSpan"; 
                    $rootScope.$broadcast('AppNameChanged', results.data.siteName);
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        }
    }
]);