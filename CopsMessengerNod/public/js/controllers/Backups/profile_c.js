myAppControllers.controller('ProfileCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
	$scope.promise              = null;
        $scope.profile              = {};
        $scope.profile.name         = localStorage.getItem("name");
        $scope.profile.email        = localStorage.getItem("email");
        $scope.login_time           = localStorage.getItem("login_time");
	
	$rootScope.$broadcast('BrowserRefreshed', "NONE");
        
        $scope.doUpdateProfile     = function () {
            var input           = {};
            input["email"]      = $scope.profile.email;
            input["name"]       = $scope.profile.name;
            $scope.promise      = Data.post('ProfileCtrl/update', input).then(function(results) {
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been updated";
                    $scope.msgSpanClass     = "messageSpan"; 
                    localStorage.setItem("name", results.data.name);
                    localStorage.setItem("email", results.data.email);
                    $rootScope.$broadcast('AdminNameChanged', input["name"]);
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan"; 
                }
            });
        }
        
        $scope.doUpdatePassword     = function () {
            var input               = {};
            input["cpassword"]      = Base64.encode(Base64.encode($scope.changePassword.cpassword));
            input["npassword"]      = Base64.encode(Base64.encode($scope.changePassword.npassword));
            input["rpassword"]      = Base64.encode(Base64.encode($scope.changePassword.rpassword));
            $scope.promise          = Data.post('ProfileCtrl/change_password', input).then(function (results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been updated";
                    $scope.msgSpanClass     = "messageSpan"; 
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        }
    }
]);