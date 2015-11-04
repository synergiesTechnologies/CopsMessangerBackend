/* Controllers Continue...*/

myAppControllers.controller('PartnersCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        var search                  = $location.search();
        $scope.is_customer          = (search.i == "c") ? true : false;
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;        
        $scope.records              = [];
        $scope.msg                  = "";
        $scope.partner              = {};
        $scope.pageSize             = 10;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
        
        $rootScope.$broadcast('BrowserRefreshed', "PARTNER");
        
        $scope.refreshPartnerList           = function () {
            $scope.partner                  = {};
            $scope.partner.is_taxable       = "N";
            $scope.partner.status           = "A";
            $scope.partner.id               = "0";
            var input                       = {};
            input["category_id"]            = (search.i == "c") ? "5" : "6";
            $scope.promise                  = Data.post('PartnersCtrl/records', input).then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.records;
                }
                $scope.partner.categories   = results.categories;
            });
        };
        
        $scope.refreshPartnerList();
        
        $scope.doManagePartner  = function () {
            $scope.delay        = 0;
            $scope.minDuration  = 0;
            $scope.message      = 'Please Wait...';
            $scope.backdrop     = true;
            $scope.promise      = null;
            var input           = {};
            input["name"]       = $scope.partner.name;
            input["email"]      = $scope.partner.email;
            input["code"]       = $scope.partner.code;
            input["category_id"]= ($scope.is_customer == true) ? "5" : "6";
            input["address"]    = $scope.partner.address;
            input["city"]       = $scope.partner.city;
            input["state"]      = $scope.partner.state;
            input["pincode"]    = $scope.partner.pincode;
            input["phone"]      = $scope.partner.phone;
            input["mobile"]     = $scope.partner.mobile;
            input["fax"]        = $scope.partner.fax;
            input["vat_number"] = $scope.partner.vat_number;
            input["pin_number"] = $scope.partner.pin_number;
            input["cst_number"] = $scope.partner.cst_number;
            input["kfdl_number"]= $scope.partner.kfdl_number;
            input["is_taxable"] = $scope.partner.is_taxable;
            input["single_commodity_name"]     = $scope.partner.single_commodity_name;
            input["status"]     = $scope.partner.status;
            input["id"]         = $scope.partner.id;
            $scope.promise      = Data.post('PartnersCtrl/manage', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been saved";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.partner          = {};
                    $scope.PartnerFrm.$setPristine();
                    $scope.refreshPartnerList();
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.viewAndEditRecord        = function(selRecord){
            $scope.partner.name         = selRecord.name;
            $scope.partner.email        = selRecord.email;
            $scope.partner.code         = selRecord.code;
            $scope.partner.category     = {"id":selRecord.category_id, "name":selRecord.category_name};            
            $scope.partner.address      = selRecord.address;
            $scope.partner.city         = selRecord.city;
            $scope.partner.state        = selRecord.state;
            $scope.partner.pincode      = selRecord.pincode;
            $scope.partner.phone        = selRecord.phone;
            $scope.partner.mobile       = selRecord.mobile;
            $scope.partner.fax          = selRecord.fax;
            $scope.partner.vat_number   = selRecord.vat_number;
            $scope.partner.pin_number   = selRecord.pin_number;
            $scope.partner.cst_number   = selRecord.cst_number;
            $scope.partner.kfdl_number  = selRecord.kfdl_number;
            $scope.partner.is_taxable   = selRecord.is_taxable;
            $scope.partner.status       = selRecord.status;
            $scope.partner.single_commodity_name    = selRecord.single_commodity_name;
            $scope.partner.id		= selRecord.id;
            $scope.msg                  = "";
        }
        
        $scope.doDeletePartner  = function (selRecord) {
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
            input["keyword"]    = $scope.partner.keyword;
            $scope.promise      = Data.post('PartnersCtrl/records', input).then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records     = results.records;
                } else {
                    
                }
            });
        };
        
        $scope.clearThisForm = function(){
	    $scope.partner.name         = "";
            $scope.partner.email        = "";
            $scope.partner.code         = "";
            $scope.partner.category     = "";           
	    $scope.partner.address      = "";
            $scope.partner.city         = "";
            $scope.partner.state        = "";
            $scope.partner.pincode      = "";
            $scope.partner.phone        = "";
            $scope.partner.mobile       = "";
            $scope.partner.fax          = "";
            $scope.partner.vat_number   = "";
            $scope.partner.pin_number   = "";
            $scope.partner.cst_number   = "";
            $scope.partner.kfdl_number  = "";
            $scope.partner.is_taxable   = "N";
            $scope.partner.single_commodity_name    = "";
            $scope.partner.status       = "A";
	    $scope.partner.id		= "0";
            $scope.msg                  = "";
            $scope.PartnerFrm.$setPristine();
	    return false;
	};
    }
]);