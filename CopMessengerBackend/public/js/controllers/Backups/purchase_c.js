/* Controllers Continue...*/
myAppControllers.controller('PurchaseCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;
        $scope.vendors              = [];
        $scope.vendor               = null;
        $scope.records              = [];
        $scope.msg                  = "";
        $scope.purchase             = {};
        $scope.pageSize             = 10;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
        $scope.invoice_types        = [{"id":"Form No. 8", "name":"Form No. 8"}, {"id":"Form No. 8A", "name":"Form No. 8A"}, {"id":"Form No. 8B", "name":"Form No. 8B"}];
        $scope.purchase.bill_number = "";
        
        $rootScope.$broadcast('BrowserRefreshed', "BILL");
        
        $scope.refreshPurchaseBillList      = function () {
            $scope.vendor                   = null;
            $scope.purchase                 = {};
            $scope.purchase.id              = "0";
            $scope.purchase.bill_number     = "";
            $scope.promise                  = Data.get('BillingCtrl/records_purchase').then(function(results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.records;
                }
                $scope.vendors              = results.vendors;
            });
        };
        
        $scope.refreshPurchaseBillList();
        
        $scope.clearThisForm = function(){
            $scope.vendor               = null;
            $scope.purchase             = {};
            $scope.purchase.id          = "0";
            $scope.purchase.bill_number = "";
            $scope.msg                  = "";
            $scope.PurchaseFrm.$setPristine();
	    return false;
	};
	
	$scope.calculateTotalAmount		= function() {
		var net_amount              	= ($scope.purchase.net_amount != undefined && $scope.purchase.net_amount != null) ? $scope.purchase.net_amount : 0;
		var discount             	= ($scope.purchase.discount != undefined && $scope.purchase.discount != null) ? $scope.purchase.discount : 0;
		var tax_amount              	= 0;		
		
		if ($scope.purchase.tax_percentage != undefined && $scope.purchase.tax_percentage != null && $scope.purchase.tax_percentage > 0) {
			tax_amount		= ($scope.purchase.tax_amount == undefined || $scope.purchase.tax_amount == null || $scope.purchase.tax_amount == 0) ? ((net_amount * parseFloat($scope.purchase.tax_percentage)) / 100) : $scope.purchase.tax_amount;
		}
		
		net_amount			= parseFloat(Math.round(net_amount * 100) / 100).toFixed(2);
		tax_amount			= parseFloat(Math.round(tax_amount * 100) / 100).toFixed(2);
		discount			= parseFloat(Math.round(discount * 100) / 100).toFixed(2);
		var totalAmnt			= parseFloat(net_amount) + parseFloat(tax_amount) - parseFloat(discount);
		totalAmnt			= parseFloat(Math.round(totalAmnt * 100) / 100).toFixed(2);
		$scope.purchase.tax_amount	= parseFloat(tax_amount);
		$scope.purchase.total_amount  	= (totalAmnt);
	};
	        
        $scope.doManagePurchase             = function () {
            $scope.delay                    = 0;
            $scope.minDuration              = 0;
            $scope.message                  = 'Please Wait...';
            $scope.backdrop                 = true;
            $scope.promise                  = null;
            var input                       = {};
            input["bill_number"]            = $scope.purchase.bill_number;
            input["date"]                   = $scope.purchase.date.getTime() / 1000;
            input["type"]                   = $scope.purchase.type["id"];
            input["tax_percentage"]         = $scope.purchase.tax_percentage;
            input["tax_amount"]             = $scope.purchase.tax_amount;
            input["net_amount"]             = $scope.purchase.net_amount;
            input["discount"]               = $scope.purchase.discount;
            input["total_amount"]           = $scope.purchase.total_amount;
            input["comments"]               = $scope.purchase.comments;
            input["vendor_id"]              = $scope.vendor.id;
            input["vendor_name"]            = $scope.vendor.name;
            input["vendor_email"]           = $scope.vendor.email;
            input["vendor_address"]         = $scope.vendor.address;
            input["vendor_phone"]           = $scope.vendor.phone;
            input["vendor_mobile"]          = $scope.vendor.mobile;
            input["vendor_fax"]             = $scope.vendor.fax;
            input["vendor_tin"]             = $scope.vendor.vat_number;
            input["vendor_cst"]             = $scope.vendor.cst_number;
            input["vendor_kfdl"]            = $scope.vendor.kfdl_number;
            input["id"]                     = $scope.purchase.id;
            
            $scope.promise                  = Data.post('BillingCtrl/purchase_manage', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been saved";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.purchase         = {};
                    $scope.PurchaseFrm.$setPristine();
                    $scope.refreshPurchaseBillList();
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.viewAndEditRecord                    = function(selRecord){
            $scope.vendor                           = {};
            $scope.purchase                         = {};
            $scope.purchase.bill_number             = parseInt(selRecord.bill_number);
            $scope.purchase.date                    = new Date(selRecord.date);
            $scope.purchase.type                    = (selRecord.type === 'Form No. 8') ? $scope.invoice_types[0] : ((selRecord.type === 'Form No. 8A') ? $scope.bill_types[1] : $scope.bill_types[2]);            
            $scope.purchase.tax_percentage          = parseFloat(selRecord.tax_percentage);
            $scope.purchase.tax_amount              = parseFloat(selRecord.tax_amount);
            $scope.purchase.net_amount              = parseFloat(selRecord.net_amount);
            $scope.purchase.discount                = parseFloat(selRecord.discount);
            $scope.purchase.total_amount            = parseFloat(selRecord.total_amount);
            $scope.purchase.comments                = selRecord.comments;            
            var tempVendorObject                    = {};
            tempVendorObject.id                     = selRecord.vendor_id;
            $scope.vendor                           = $scope.getActualVendorObject(tempVendorObject, $scope.vendors);
            $scope.purchase.id                      = selRecord.id;
            $scope.msg                              = "";
        };
        
        $scope.doDeleteBill  = function (selRecord) {
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
                                        input["bill_number"]= selRecord.bill_number;
					$scope.promise      = Data.post('BillingCtrl/purchase_delete', input).then(function (results) {                
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
        
        $scope.getActualVendorObject                = function(refObject, objectsArray){
            var anObjectRec                         = null;
            var totalRecs                           = objectsArray.length;
            if (totalRecs > 0) {
                for (var i = 0; i < totalRecs; i++){
                    anObjectRec                     = objectsArray[i];
                    if (anObjectRec.id == refObject.id) {
                        break;
                    }
                }
            }
            
            return anObjectRec;
        };        
    }
]);