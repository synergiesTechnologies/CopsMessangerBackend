myAppControllers.controller('LoginCntrl', ['$scope', 'Data', '$location', function($scope, Data, $location) {
        $scope.delay        		= 0;
	$scope.minDuration  		= 0;
	$scope.message      		= 'Please Wait...';
	$scope.backdrop     		= true;
	$scope.promise      		= null;
        $scope.errorMessage 		= " ";
	$scope.isLogin			= true;
	$scope.msg                  	= "";
	
	Data.get('SessionCtrl/session').then(function (results) {
            if (results.code === "SUCCESS" && results.message === "VALID_SESSION") {
		$location.path("/home");
	    }
	});
	
        $scope.doLogin          		= function() {
            var input           		= {};
            input["email"]      		= $scope.login.email_cop_msg;
            
            /*$scope.promise      = Data.post('SessionCtrl/login', input).then(function (results) {
                if (results.code === "SUCCESS") {
                    $scope.msg          = " ";
                    localStorage.setItem("id", results.data.id);
                    localStorage.setItem("name", results.data.name);
                    localStorage.setItem("email", results.data.email);
                    localStorage.setItem("login_time", results.data.login_time);
                    $location.path("/home");
                } else {
                    $scope.msg          = "Email or password incorrect";
                    $scope.msgSpanClass = "errorSpan"; 
                }
            });*/
	    
	    if ($scope.isLogin == true) {
		input["password"]   		= Base64.encode(Base64.encode($scope.login.password_cop_msg));
		if ($scope.login.email_cop_msg == 'saju@test.com' && $scope.login.password_cop_msg == '12345') {
			localStorage.setItem("id", 1);
			localStorage.setItem("name", "Admin User");
			localStorage.setItem("email", "saju@test.com");
			localStorage.setItem("login_time", "01-10-2015 10:10:10 AM");
			$location.path("/home");
		} else {
			$scope.msg         	= "Email address or password is incorrect";
			$scope.msgSpanClass 	= "errorSpan"; 
		}
	    } else {
		if ($scope.login.email_cop_msg == ''){
			$scope.msg          	= "Email address is incorrect";
			$scope.msgSpanClass 	= "errorSpan";
		}
	    } 
        };
	
	$scope.changeToResetPasswordForm	= function() {
		$scope.isLogin			= false;
		$scope.msg           		= "";
	};
	
	$scope.changeToLoginForm		= function() {
		$scope.isLogin			= true;
		$scope.msg           		= "";
	};

    }
]);