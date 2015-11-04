myAppControllers.controller('NavigationCntrl', ['$scope', '$location', 'Data',  
    function ($scope, $location, Data) {
        var name            = localStorage.getItem("name");
        if (name != undefined && name != null) {
            $scope.profileName  = name;
        }
        
        $scope.$on('AdminNameChanged', function(event, nameStr) {
            $scope.profileName  = nameStr;
        });
        
        $scope.$on('HomeViewLoaded', function(event, nameStr) {
            $scope.resetLinkSelection();
            $scope.activeDash   = "active";
        });
	
	$scope.$on('BrowserRefreshed', function(event, nameStr) {
            $scope.resetLinkSelection();
	    if (nameStr == "DASHBOARD") {
		$scope.activeDash   	= "active";
	    } else if (nameStr == "USERS") {
		$scope.activeUser   	= "active";
	    } else if (nameStr == "MESSAGE") {
		$scope.activeMsg   	= "active";
	    } else if (nameStr == "SETTINGS") {
		$scope.activeSettings   = "active";
	    } 
        });
        
        $scope.resetLinkSelection  	= function(){
            $scope.activeDash   	= "";
            $scope.activeUser 		= "";
	    $scope.activeMsg   		= "";
            $scope.activeSettings	= "";
        };       
        
        $scope.showHome  = function(){
            $scope.resetLinkSelection();
            $scope.activeDash   	= "active";
            $location.path("/home");
        };
        
        $scope.showUsers  		= function(){
            $scope.resetLinkSelection();
	    $scope.activeUser   	= "active";
            $location.path("/users");
        }
	
	$scope.showMessages  		= function(){
            $scope.resetLinkSelection();
	    $scope.activeMsg   		= "active";
            $location.path("/messages");
        }
        
	$scope.showSettings  		= function(){
            $scope.resetLinkSelection();
	    $scope.activeSettings   	= "active";
            $location.path("/settings");
        }
        
        $scope.doLogout     = function () {
            $scope.resetLinkSelection();
            //Data.get('SessionCtrl/logout').then(function (results) {
                //if (results.code === "SUCCESS") {
                    localStorage.removeItem("id");
                    localStorage.removeItem("name");
                    localStorage.removeItem("email");
                    localStorage.removeItem("login_time");
                    localStorage.clear();
                    $location.path("/login");
                /*} else {
                    localStorage.removeItem("id");
                    localStorage.removeItem("name");
                    localStorage.removeItem("email");
                    localStorage.removeItem("login_time");
                    localStorage.clear();
                    $location.path("/login");
                }*/
            //});
        }
    }
]);