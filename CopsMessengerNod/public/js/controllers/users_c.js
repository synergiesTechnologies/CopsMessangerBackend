myAppControllers.controller('UsersCntrl', ['$scope', '$location', '$rootScope', 'Data', '$route', function($scope, $location, $rootScope, Data, $route) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
	$scope.pageSize             	= 10;
        $scope.filterKey            	= "";
        $scope.currentPage	    	= 1;
	$scope.records			= [];
	$scope.record	    		= {};
	$scope.record['status']  	= 'I';
	$scope.msg                  	= "";
	$scope.categories		= [{'id':1, 'name':'School'}, {'id':2, 'name':'Jewellery'}, {'id':3, 'name':'Petrol Pump'}, {'id':4, 'name':'Hotel'}, {'id':5, 'name':'Admin'},];
	$scope.districts		= [{'id':1, 'name':'Trivandrum'},
					   {'id':2, 'name':'Kollam'},
					   {'id':3, 'name':'Pathanamthitta'},
					   {'id':4, 'name':'Idukki'},
					   {'id':5, 'name':'Alappuzha'},
					   {'id':6, 'name':'Kottayam'},
					   {'id':7, 'name':'Eranakulam'},
					   {'id':8, 'name':'Thrissure'},
					   {'id':9, 'name':'Palakkad'},
					   {'id':10, 'name':'Malappuram'},
					   {'id':11, 'name':'Wayanad'},
					   {'id':12, 'name':'Kozhikkode'},
					   {'id':13, 'name':'Kannur'},
					   {'id':14, 'name':'Kasaragode'}];
	
	$rootScope.$broadcast('BrowserRefreshed', "USERS");
	
        $scope.refreshUserPage	        = function() {
		$scope.records		= [];
	        /* $scope.promise                          = Data.get('StatisticsCtrl/homestats').then(function(results) {
                        
                }); */
		
		$scope.records.push({"id":"1", "name":"ABC College", "address":"MG Road", "district":$scope.districts[6], "category":$scope.categories[0], "status":"A"});
		$scope.records.push({"id":"2", "name":"QWERTY College", "address":"Banarji Road, North", "district":$scope.districts[6], "category":$scope.categories[0], "status":"A"});
		$scope.records.push({"id":"3", "name":"Atls Jewels", "address":"Seaport Airport Road, Kakkanad", "district":$scope.districts[6], "category":$scope.categories[1], "status":"A"});
		$scope.records.push({"id":"4", "name":"Gold Jewels", "address":"Gandhi Nagar", "district":$scope.districts[6], "category":$scope.categories[1], "status":"I"});
		$scope.records.push({"id":"5", "name":"Test College", "address":"MG Road", "district":$scope.districts[6], "category":$scope.categories[0], "status":"A"});
        };
        
	$scope.refreshUserPage();
	
	$scope.viewAndEditRecord	= function(selectedRecord) {
		$scope.record	    	= selectedRecord;
	};
	
	$scope.doDeleteRecord		= function(selectedRecord) {
		var elem 		= $(this).closest('.table');
		$.confirm({
			'title'	 : 'Delete Confirmation',
			'message': 'Are you sure, you want to delete this record?',
			'buttons': {
				'Yes': {
				    'class' : 'blue',
				    'action': function(){
                                        /*$scope.clearThisForm();
					var input           = {};
					input["id"]         = selRecord.id;
					$scope.promise      = Data.post('PartnersCtrl/delete', input).then(function (results) {                
					    if (results.code === "SUCCESS") {
						$scope.msg              = "Record has been deleted";
						$scope.msgSpanClass     = "messageSpan";
						var index 		= $scope.records.indexOf(selRecord);
						$scope.records.splice(index, 1); 
					    } else {
						$scope.msg              = results.message;
						$scope.msgSpanClass     = "errorSpan";
					    }
					});*/
					var index 		= $scope.records.indexOf(selectedRecord);
					if (index != -1) {
						$scope.records.splice(index, 1);
					}
				    }
				},
				'No': {
				    'class' : 'gray',
				    'action': function(){
					// Nothing to do in this case. You can as well omit the action property.
				    }	
				}
			}
		});
	};
	
	$scope.doManageRecord			= function() {
		var aNewRecord			= {};
		if ($scope.record.id == undefined || $scope.record.id == null || $scope.record.id == "0") {
			aNewRecord['id']	= $scope.records.length;
			aNewRecord['name']	= $scope.record.name;
			aNewRecord['address']	= $scope.record.address;
			aNewRecord['city']	= $scope.record.city;
			aNewRecord['district']	= $scope.record.district;
			aNewRecord['category']	= $scope.record.category;
			aNewRecord['email']	= $scope.record.email;
			aNewRecord['mobile']	= $scope.record.mobile;
			aNewRecord['password']	= $scope.record.password;
			aNewRecord['cpassword']	= $scope.record.cpassword;
			aNewRecord['status']	= $scope.record.status;
			$scope.records.push(aNewRecord);
			$scope.clearThisForm();
			$scope.msg              = "Record has been saved";
			$scope.msgSpanClass     = "messageSpan";
		} else {
			$scope.msg              = "Edit Not Implemented";
			$scope.msgSpanClass     = "errorSpan";
		}
	};
	
	$scope.clearThisForm			= function() {
		$scope.record	    		= {};
		$scope.record['status']  	= 'I';
		$scope.msg                  	= "";
		$scope.CurFrm.$setPristine();
		return false;
	};
}]);