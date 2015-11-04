/* Controllers Continue...*/

myAppControllers.controller('MappingCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;        
        $scope.records              = []; // all mappings
        $scope.customers            = []; // all cutomers
        $scope.products             = []; // all products
        $scope.msg                  = "";
        $scope.mapping              = {};
        $scope.mapping.remcustomers = []; // remaining cutomers [all customers - selected customers]
        $scope.mapping.remproducts  = []; // remaining products [all products - selected products]
        $scope.mapping.selcustomers = []; // selected cutomers
        $scope.mapping.selproducts  = []; // selected products
        $scope.pageSize             = 10;
        $scope.filterKey            = "";
        $scope.currentPage	    = 1;
        $scope.mappedCustomersArray = [];
	$scope.quantityPerPacketTypes = [{"id":"NA", "name":"NA"}, {"id":"100 gm", "name":"100 gm"}, {"id":"150 gm", "name":"150 gm"}, {"id":"200 gm", "name":"200 gm"}, {"id":"250 gm", "name":"250 gm"}, {"id":"500 gm", "name":"500 gm"}, {"id":"1 kg", "name":"1 kg"}];
        $scope.form8b_map_id        = -1;
        
        $rootScope.$broadcast('BrowserRefreshed', "PARTNER");
        
        $scope.refreshMappingsList          = function () {
            $scope.mapping                  = {};
            $scope.mapping.is_form8b        = "N";
            $scope.mapping.status           = "A";
            $scope.mapping.id               = "0";
            $scope.mapping.remcustomers     = [];
            $scope.mapping.remproducts      = [];
            $scope.mapping.selcustomers     = [];
            $scope.mapping.selproducts      = [];
            $scope.records                  = [];
            $scope.form8b_map_id            = -1;
            var allCustIdStr                = "";
            $scope.promise                  = Data.get('MappingsCtrl/records').then(function (results) {
                if (results.code === "SUCCESS") {                
                    var allRecords          = results.records;
                    if (allRecords != undefined && allRecords != null) {
                        var totalRecLength  = allRecords.length;
                        var aRecord         = null;
                        var aMappingRecord  = null;
                        var aPdtRecord      = null;                        
                        var mappingList     = {};
                        if (totalRecLength > 0) {
                            for (var i = 0; i < totalRecLength; i++){
                                aRecord                 = allRecords[i];                                
                                if (mappingList[aRecord['id']] == undefined || mappingList[aRecord['id']] == null) {
                                    aMappingRecord                  = {};
                                    aMappingRecord['id']            = aRecord['id'];
                                    aMappingRecord['name']          = aRecord['name'];
                                    aMappingRecord['customerIds']   = aRecord['customerIds'];
                                    aMappingRecord['customerNames'] = aRecord['customerNames'];
                                    aMappingRecord['status']        = aRecord['status'];
                                    mappingList[aRecord['id']]      = aMappingRecord;
                                    allCustIdStr                    = allCustIdStr + aRecord['customerIds'] + ",";
                                }
                                
                                aPdtRecord                  		= {};
                                aPdtRecord['product_id']    		= aRecord['product_id'];
                                aPdtRecord['price_id']      		= aRecord['price_id'];
                                aPdtRecord['priceperkg']    		= aRecord['price_per_kg'];
                                aPdtRecord['priceperpacket']		= aRecord['price_per_packet'];
                                aPdtRecord['quantity_per_packet']	= {'id':aRecord['quantity_per_packet'], 'name':aRecord['quantity_per_packet']};
                                aMappingRecord              		= mappingList[aRecord['id']];
                                
                                if (aMappingRecord['products'] == undefined || aMappingRecord['products'] == null) {
                                    aMappingRecord['products'] = [];
                                }
                                
                                aMappingRecord['products'].push(aPdtRecord);
                            }
                        }
                    }
                }
                
                for (var key in mappingList){
                    $scope.records.push(mappingList[key]);                    
                }
                
                var allCustIdsArray         = allCustIdStr.split(',');
                allCustIdsArray.splice((allCustIdsArray.length - 1), 1);
                $scope.mappedCustomersArray = allCustIdsArray;
                                
                $scope.customers            = results.customers;
                $scope.products             = results.products;
                
                $scope.form8b_map_id        = results.form8b_map_id;
                
                $scope.fillRemCustomers();
                //console.log($scope.mapping.remcustomers);
                $scope.fillRemProducts();
            });
        };
        
        $scope.refreshMappingsList();
                
        $scope.doManageMapping  = function () {
            //console.log("priceperkg: " + JSON.stringify(priceperkg));
            var custArray       = [];
            var pdtArray        = [];
            var anError         = false;
            var dupCustomer     = null;
            if ($scope.mapping.selcustomers != undefined && $scope.mapping.selcustomers != null && $scope.mapping.selcustomers.length > 0) {
                var arrLength   = $scope.mapping.selcustomers.length;
                
                for (var i = 0; i < arrLength; i++){
                    if ($scope.mapping.selcustomers[i].disabled) {
                        anError     = true;
                        dupCustomer = $scope.mapping.selcustomers[i];
                        break;
                    }
                    custArray.push($scope.mapping.selcustomers[i].id);
                }
            }
            if (!anError) {                
                if ($scope.mapping.selproducts != undefined && $scope.mapping.selproducts != null && $scope.mapping.selproducts.length > 0) {
                    var arrLength   = $scope.mapping.selproducts.length;
                    var aRecord     = null;
                    for (var i = 0; i < arrLength; i++){
                        aRecord                     = {};
                        aRecord['product_id']       = $scope.mapping.selproducts[i]['id'];
                        aRecord['priceperkg']       = $scope.mapping.selproducts[i]['priceperkg'];
                        aRecord['priceperpacket']   = $scope.mapping.selproducts[i]['priceperpacket'];
			aRecord['quantity_per_packet']   = $scope.mapping.selproducts[i]['quantity_per_packet'];
                        pdtArray.push(aRecord);
                    }
                }
            
                $scope.delay        = 0;
                $scope.minDuration  = 0;
                $scope.message      = 'Please Wait...';
                $scope.backdrop     = true;
                $scope.promise      = null;
                var input           = {};
                input["name"]       = $scope.mapping.name;
                input["customers"]  = custArray.join(',');
                input["products"]   = pdtArray;
                input["status"]     = $scope.mapping.status;
                input["is_form8b"]  = $scope.mapping.is_form8b;
                input["id"]         = $scope.mapping.id;
                $scope.promise      = Data.post('MappingsCtrl/manage', input).then(function (results) {                
                    if (results.code === "SUCCESS") {
                        $scope.msg              = "Record has been saved";
                        $scope.msgSpanClass     = "messageSpan";
                        $scope.mapping          = {};
                        $scope.MappingFrm.$setPristine();
                        $scope.refreshMappingsList();
                    } else {
                        $scope.msg              = results.message;
                        $scope.msgSpanClass     = "errorSpan";
                    }
                });
            } else {
                $scope.msg              = "The customer '" + dupCustomer.name + "' already used in another mapping";
                $scope.msgSpanClass     = "errorSpan";
            }
        };
        
        $scope.viewAndEditRecord        = function(selRecord){
            //console.log(selRecord);
            $scope.msg                  = "";
            $scope.mapping.name         = selRecord.name;
            $scope.mapping.status       = selRecord.status;
            $scope.mapping.id           = selRecord.id;
            $scope.mapping.remproducts  = [];
            $scope.mapping.remcustomers = [];
            $scope.mapping.selproducts  = [];
            $scope.mapping.selcustomers = [];            
            $scope.mapping.is_form8b    = (parseInt(selRecord.id) === parseInt($scope.form8b_map_id["form8b_mapping_id"])) ? "Y" : "N";
            $scope.msg                  = "";
            
            var allCustLength           = $scope.customers.length;
            var customerIds             = selRecord.customerIds.split(',');
            var totalArrLen             = customerIds.length;
            var aSelCustomer            = {};
            var aCustomer               = {};
            var isSelected              = false;
            for (var i = 0; i < allCustLength; i++){
                isSelected              = false;
                aCustomer               = $scope.customers[i];
                for (var j = 0; j < totalArrLen; j++){
                    aSelCustomer        = customerIds[j];
                    if (aSelCustomer == aCustomer['id']) {
                        isSelected      = true;
                        aCustomer['disabled'] = false;
                        break;
                    }
                }
                if (isSelected == true) {
                    $scope.mapping.selcustomers.push(aCustomer);
                } else {
                    $scope.mapping.remcustomers.push(aCustomer);
                }
            }
            
            var allProdLength           = $scope.products.length;
            var totalSelProdLen         = selRecord.products.length;
            var aSelProduct             = {};
            var aProduct                = {};
            var isProdSelected          = false;
            for (var i = 0; i < allProdLength; i++){
                isProdSelected          = false;
                aProduct                = $scope.products[i];
                for (var j = 0; j < totalSelProdLen; j++){
                    aSelProduct         = selRecord.products[j];
                    if (aSelProduct['product_id'] == aProduct['id']) {
                        aProduct['priceperkg']      = aSelProduct['priceperkg'];
                        aProduct['priceperpacket']  = aSelProduct['priceperpacket'];
			aProduct['quantity_per_packet'] = aSelProduct['quantity_per_packet'];
                        isProdSelected              = true;
                        break;
                    }
                }
                if (isProdSelected == true) {
                    $scope.mapping.selproducts.push(aProduct);
                } else {
                    aProduct['priceperkg']          = "";
                    aProduct['priceperpacket']      = "";
		    aProduct['quantity_per_packet'] = {"id":"NA", "name":"NA"};
                    $scope.mapping.remproducts.push(aProduct);
                }
            }
        };
        
        $scope.doDeleteMapping  = function () {
            var input           = {};
            input["id"]         = $scope.mapping.id;
            $scope.promise      = Data.post('MappingsCtrl/delete', input).then(function (results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been deleted";
                    $scope.msgSpanClass     = "messageSpan";
                    $rootScope.$broadcast('ProductDeleted', input);
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.doSearchProduct  = function () {
            var input           = {};
            input["keyword"]    = $scope.mapping.keyword;
            $scope.promise      = Data.post('MappingsCtrl/records', input).then(function (results) {
                if (results.code === "SUCCESS") {                
                    $scope.records     = results.records;
                } else {
                    
                }
            });
        };
        
        //$scope.moveSelRecToRight    = function (selRecord) {
            //$scope.mapping.selcustomers.push(selRecord[0]);
            //var index 		    = $scope.mapping.remcustomers.indexOf(selRecord[0]);
            //$scope.mapping.remcustomers.splice(index, 1);
        //}
        
        //$scope.moveSelRecToLeft     = function (selRecord) {
            //$scope.mapping.remcustomers.push(selRecord[0]);
            //var index 		    = $scope.mapping.selcustomers.indexOf(selRecord[0]);
            //$scope.mapping.selcustomers.splice(index, 1);
        //}
        
        $scope.addCustomersToSelectedList = function (){            
            if ($scope.mapping.remainingcustomers == undefined || $scope.mapping.remainingcustomers.length == 0) {
                $scope.msg              = "Please select record from customers list";
                $scope.msgSpanClass     = "errorSpan";
            } else {
                var recLen              = $scope.mapping.remainingcustomers.length;
                var anObjectRec         = null;
                for (var i = 0; i < recLen; i++){
                    anObjectRec         = $scope.getActualCustomerObject($scope.mapping.remainingcustomers[i], $scope.mapping.remcustomers);
                    $scope.mapping.selcustomers.push(anObjectRec);
                    var index 		= $scope.mapping.remcustomers.indexOf(anObjectRec);
                    $scope.mapping.remcustomers.splice(index, 1);
                }
                $scope.mapping.remainingcustomers   = [];
            }
        };
        
        $scope.removeCustomersFromSelectedList = function (){            
            if ($scope.mapping.selectedcustomers == undefined || $scope.mapping.selectedcustomers.length == 0) {
                $scope.msg              = "Please select record from selected customers list";
                $scope.msgSpanClass     = "errorSpan";
            } else {
                var recLen              = $scope.mapping.selectedcustomers.length;
                var anObjectRec         = null;
                for (var i = 0; i < recLen; i++){
                    anObjectRec         = $scope.getActualCustomerObject($scope.mapping.selectedcustomers[i], $scope.mapping.selcustomers);
                    $scope.mapping.remcustomers.push(anObjectRec);
                    var index 		= $scope.mapping.selcustomers.indexOf(anObjectRec);
                    $scope.mapping.selcustomers.splice(index, 1);
                }
                $scope.mapping.selectedcustomers    = [];
            }
        };
        
        $scope.doAddProduct         = function (selRecord) {
            $scope.mapping.selproducts.push(selRecord);
            var index 		    = $scope.mapping.remproducts.indexOf(selRecord);
            $scope.mapping.remproducts.splice(index, 1);
            $scope.mapping.searchkey= "";
        };
        
        $scope.doDeleteAddedRec     = function (selRecord) {
            $scope.mapping.remproducts.push(selRecord);
            var index 		    = $scope.mapping.selproducts.indexOf(selRecord);
            $scope.mapping.selproducts.splice(index, 1);
            $scope.mapping.searchkey= "";
        };
        
        $scope.clearThisForm = function(){
	    $scope.mapping.name             = "";
            $scope.mapping.code             = "";
            $scope.mapping.status           = "A";
            $scope.mapping.is_form8b        = "N";
            $scope.mapping.selcustomers     = [];
            $scope.mapping.selproducts      = [];
	    $scope.mapping.id		    = "0";
            $scope.msg                      = "";
            $scope.fillRemCustomers();
            $scope.fillRemProducts();
            $scope.MappingFrm.$setPristine();
	    return false;
	};
        
        $scope.fillRemCustomers             = function(){
            $scope.mapping.remcustomers     = [];
            var aCustObject                 = null;
            var totalRecs                   = $scope.customers.length;
            if (totalRecs > 0) {                
                for (var i = 0; i < totalRecs; i++){
                    aCustObject             = $scope.customers[i];
                    aCustObject['disabled'] = ($scope.mappedCustomersArray.indexOf(aCustObject.id) == -1) ? false : true;
                    $scope.mapping.remcustomers.push(aCustObject);
                }
            }
        };
        
        $scope.fillRemProducts              = function(){
            $scope.mapping.remproducts      = [];
            var totalRecs                   = $scope.products.length;
            if (totalRecs > 0) {
                for (var i = 0; i < totalRecs; i++){
                    $scope.products[i]['priceperpacket']    = "";
                    $scope.products[i]['priceperkg']        = "";
		    $scope.products[i]['quantity_per_packet']        = {'id':'NA', 'name':'NA'};
                    $scope.mapping.remproducts.push($scope.products[i]);
                }
            }
        };
        
        $scope.getActualCustomerObject      = function(refObject, objectsArray){
            var anObjectRec                 = {};
            var totalRecs                   = objectsArray.length;
            if (totalRecs > 0) {
                for (var i = 0; i < totalRecs; i++){
                    anObjectRec             = objectsArray[i];
                    if (anObjectRec.id == refObject.id) {
                        break;
                    }
                }
            }
            
            return anObjectRec;
        };
	
	$scope.clearPriceFields				= function(aPdt, type){
		if (type == 'kg') {
			aPdt.priceperkg 		= '';
		} else {
			aPdt.priceperpacket		= '';
			aPdt.quantity_per_packet	= {"id":"NA", "name":"NA"};
		}
		
	};
    }
]);