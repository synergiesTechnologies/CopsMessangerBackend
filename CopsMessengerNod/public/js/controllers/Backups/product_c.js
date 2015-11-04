myAppControllers.controller('ProductsCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;        
        $scope.records              = [];
        $scope.msg                  = "";
        $scope.product              = {};
	$scope.pageSize             = 10;
        $scope.filterKey            = "";
	$scope.currentPage	    = 1;
	$rootScope.$broadcast('BrowserRefreshed', "PRODUCT");
        
        $scope.refreshProductList       = function() {
	    $scope.product              = {};
            $scope.product.status       = "A";
            $scope.product.id           = "0";
            $scope.product.image        = "./img/no_image.jpeg";
            $scope.promise              = Data.post('ProductsCtrl/records').then(function (results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.records;                    
                }
		$scope.product.categories   = results.categories;
            });
        };
        
        $scope.refreshProductList();
        
        $scope.doManageProduct  = function () {
            $scope.delay        = 0;
            $scope.minDuration  = 0;
            $scope.message      = 'Please Wait...';
            $scope.backdrop     = true;
            $scope.promise      = null;
            var input           = {};
            input["name"]       = $scope.product.name;
            input["code"]       = $scope.product.code;
            input["category_id"]= $scope.product.category.id;
            input["image"]      = $scope.product.image;
            input["status"]     = $scope.product.status;
            input["id"]         = $scope.product.id;
	    $scope.msg          = "";
            $scope.promise      = Data.post('ProductsCtrl/manage', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been saved";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.product          = {};
                    $scope.ProductFrm.$setPristine();
                    $scope.refreshProductList();
                    angular.element(document.getElementById('image')).val('');
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.viewAndEditRecord        = function(selRecord){
            $scope.product.name         = selRecord.name;
            $scope.product.code         = selRecord.code;
            $scope.product.category     = {"id":selRecord.category_id, "name":selRecord.category_name};
            $scope.product.status       = selRecord.status;
            $scope.product.image        = selRecord.image;
	    $scope.product.id		= selRecord.id;
        }
        
        $scope.doDeleteProduct  = function (selRecord) {
	    var elem 	= $(this).closest('.table');
	    $.confirm({
		'title'	 : 'Delete Confirmation',
		'message': 'Are you sure, you want to delete this record?',
		'buttons': {
				'Yes': {
				    'class' : 'blue',
				    'action': function(){
					$scope.clearThisForm();
					var input           = {};
					input["id"]         = selRecord.id;
					$scope.promise      = Data.post('ProductsCtrl/delete', input).then(function (results) {                
					    if (results.code === "SUCCESS") {
						$scope.msg              = "Record has been deleted";
						$scope.msgSpanClass     = "messageSpan";
						var index 		= $scope.records.indexOf(selRecord);
						$scope.records.splice(index, 1); 
					    } else {
						$scope.msg              = results.message;
						$scope.msgSpanClass     = "errorSpan";
					    }
					});
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
        
        $scope.doSearchProduct  = function () {
            var input           = {};
            input["keyword"]    = $scope.products.keyword;
            $scope.promise      = Data.post('ProductsCtrl/records', input).then(function (results) {
                if (results.code === "SUCCESS") {                
                    $scope.records  = results.data;
                } else {
                    
                }
            });
        };
	
	$scope.clearThisForm = function(){
	    $scope.product.name         = "";
            $scope.product.code         = "";
            $scope.product.category     = "";
            $scope.product.status       = "A";
	    $scope.product.image        = "./img/no_image.jpeg";
	    $scope.product.id		= "0";
	    $scope.msg                  = "";
	    angular.element(document.getElementById('image')).val('');
	    $scope.ProductFrm.$setPristine();
	    return false;
	};
	
	$scope.doResetPhoto	= function(){
	    $scope.product.image        = "./img/no_image.jpeg";
	};
    }
]);