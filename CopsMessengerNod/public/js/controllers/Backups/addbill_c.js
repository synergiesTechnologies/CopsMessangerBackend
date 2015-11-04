myAppControllers.controller('AddBillCntrl', ['$scope', '$location', '$rootScope', 'Data', 'UserService', '$route', function($scope, $location, $rootScope, Data, UserService, $route) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
        $scope.sale_products        	= [];
        $scope.customers            	= [];
        $scope.customer             	= {};
        $scope.product_prices       	= [];
        $scope.msg                  	= "";
        $scope.profile              	= {};
        $scope.fin_year_info        	= {};
        $scope.sale                 	= {};
        $scope.form8bClass          	= "previewWidth38Percent borderNone";
        $scope.bill_types           	= [{"id":"Form No. 8", "name":"Form No. 8"}, {"id":"Form No. 8B", "name":"Form No. 8B"}];
        $scope.taxableOptions       	= [{"optId":"Y", "optName":"Yes"}, {"optId":"N", "optName":"No"}];
        $scope.statusOptions        	= [{"optId":"Issued", "optName":"Issued"}, {"optId":"Cancelled", "optName":"Cancelled"}, {"optId":"Saved", "optName":"Saved"}];
        $scope.customer.is_taxable  	= $scope.taxableOptions[0];
        $scope.cancelledWaterMark   	= false;
        $scope.sale.bill_number     	= "";
	$scope.previewOnly		= false;
	
        $rootScope.$broadcast('BrowserRefreshed', "BILL");
        
        $scope.refreshSalesBillList		= function () {
		if ($scope.previewOnly	== true && (UserService.selectedSaleBill == undefined || UserService.selectedSaleBill == null)) {
			$scope.showBillListing();
		} else {
			$scope.sale_products            = [];
			$scope.profile                  = {};
			$scope.fin_year_info            = {};
			$scope.customer                 = {};
			$scope.sale                     = {};
			$scope.sale.status              = $scope.statusOptions[0];
			$scope.sale.id                  = "0";
			$scope.form8bClass              = "previewWidth38Percent borderNone";
			$scope.customer.is_taxable      = $scope.taxableOptions[0];
			$scope.cancelledWaterMark       = false;
			$scope.sale.bill_number         = "";
			$scope.promise                  = Data.get('BillingCtrl/records').then(function(results) {		
			    $scope.updateCustomerTaxField(results.customers);
			    $scope.profile              = results.profile;
			    $scope.fin_year_info        = results.fin_details;
			});
		}
        };
        
        $scope.refreshSalesBillList();
	
	$scope.updateCustomerTaxField       		= function(customersArray){
		var arrayLen                    	= customersArray.length;
		var aRecObject                  	= null;
		$scope.customers                	= [];
		if (arrayLen > 0) {
			for (var i = 0; i < arrayLen; i++){
				aRecObject             	= customersArray[i];
				if (aRecObject.is_taxable === "Y") {
					aRecObject.is_taxable	= {"optId":"Y", "optName":"Yes"};
				} else {
					aRecObject.is_taxable	= {"optId":"N", "optName":"No"};
				}
				var fulladdress		= aRecObject.address;
				fulladdress		+= (aRecObject.city != undefined && aRecObject.city != null && aRecObject.city.trim().length > 0) ? (", " + aRecObject.city) : "";
				fulladdress		+= (aRecObject.state != undefined && aRecObject.state != null && aRecObject.state.trim().length > 0) ? (", " + aRecObject.state) : "";
				fulladdress		+= (aRecObject.pincode != undefined && aRecObject.pincode != null && aRecObject.pincode.trim().length > 0) ? (" - " + aRecObject.pincode) : "";
				aRecObject.fulladdress  = fulladdress;
				$scope.customers.push(aRecObject);
			}
		    
			if (UserService.selectedSaleBill != undefined && UserService.selectedSaleBill != null) {
				var selRecord           	= UserService.selectedSaleBill;
				$scope.invoicePreview(selRecord);
			}
		}                
        };
	
	$scope.invoicePreview              		= function(selRecord) {
		$scope.previewOnly			= true;
		$scope.customer                		= {};
		$scope.sale                        	= {};            
		$scope.sale.type                   	= (selRecord.type === 'Form No. 8') ? $scope.bill_types[0] : $scope.bill_types[1];           
		$scope.sale.status                 	= (selRecord.status === 'Issued') ? $scope.statusOptions[0] : ((selRecord.status === 'Cancelled') ? $scope.statusOptions[1] : $scope.statusOptions[2]);
		$scope.sale.formh_received        	= selRecord.formh_received;            
		$scope.sale.delivery_note          	= selRecord.delivery_note;
		$scope.sale.purchase_order   		= selRecord.purchase_order;
		$scope.sale.despatch_doc        	= selRecord.despatch_doc;
		$scope.sale.delivery_terms        	= selRecord.delivery_terms;
		$scope.sale.vehicle_number       	= selRecord.vehicle_number;
            
		if (selRecord.type === 'Form No. 8') {
			var tempCustObject            	= {};
			tempCustObject.id              	= selRecord.customer_id;
			$scope.customer               	= $scope.getActualCustomerObject(tempCustObject, $scope.customers);
		} else {
			$scope.customer.id          	= selRecord.customer_id;
		}
		$scope.customer.name                    = selRecord.customer_name;
		$scope.customer.email                   = selRecord.customer_email;
		$scope.customer.address                 = selRecord.customer_address;
		$scope.customer.fulladdress             = selRecord.customer_fulladdress;
		$scope.customer.phone                   = selRecord.customer_phone;
		$scope.customer.mobile                  = selRecord.customer_mobile;
		$scope.customer.fax                     = selRecord.customer_fax;
		$scope.customer.vat_number              = selRecord.customer_vat_number;
		$scope.customer.pin_number              = selRecord.customer_pin_number;
		$scope.customer.cst_number              = selRecord.customer_cst_number;
		$scope.customer.is_taxable              = (selRecord.taxable === 'Y') ? $scope.taxableOptions[0] : $scope.taxableOptions[1];
		$scope.customer.single_commodity_name   = selRecord.single_commodity_name;
		$scope.profile.name                     = selRecord.profile_name;
		$scope.profile.email                    = selRecord.profile_email;
		$scope.profile.address                  = selRecord.profile_address;
		$scope.profile.city                     = selRecord.profile_city;
		$scope.profile.state                    = selRecord.profile_state;
		$scope.profile.pincode                  = selRecord.profile_pincode;
		$scope.profile.phone                    = selRecord.profile_phone;
		$scope.profile.mobile                   = selRecord.profile_mobile;
		$scope.profile.fax                      = selRecord.profile_fax;
		$scope.profile.tin_number               = selRecord.profile_tin_number;
		$scope.sale.id                          = selRecord.id;
		$scope.msg                              = "";
		$scope.sale.bill_number                 = parseInt(selRecord.bill_number);
		$scope.sale.date                        = new Date(selRecord.date);
		$scope.fin_year_info['tax_rate']        = (selRecord.tax_percentage);
		$scope.tax_amount                       = (selRecord.tax_amount);
		$scope.net_amount                       = (selRecord.net_amount);
		$scope.adjustment                       = parseFloat(selRecord.discount);
		$scope.grand_total                      = (selRecord.total_amount);
		$scope.grand_total_in_words 		= toWords(selRecord.total_amount);
		if (selRecord.type === 'Form No. 8') {
			$scope.getPriceDetails($scope.customer, 'CUSTOMER', true, selRecord);
		} else {
			$scope.getPriceDetails($scope.sale.type, 'BILL_TYPE', true, selRecord);
		}
        };
	
        $scope.getPriceDetails          		= function(selectedRecord, selectedOpt, isEditMode, billRecord){
		$scope.sale_products       		= [];
		$scope.product_prices       		= [];
		if (isEditMode == false) {
			$scope.net_amount           	= "";
			$scope.tax_amount           	= "";
			$scope.grand_total          	= "";            
			$scope.grand_total_in_words 	= "";
		}
            
		var input                   		= {};
		if (selectedOpt === "BILL_TYPE" && selectedRecord != undefined && selectedRecord.id === "Form No. 8B") {
			$scope.form8bClass     	 	= "previewWidth38Percent borderBlack1px borderRadius10px";
			input["customer_id"]    	= "-1"; //To select form 8b based mapping details
			input["type"]           	= selectedRecord["id"]; 
			$scope.promise          	= Data.post('BillingCtrl/prices', input).then(function(results) {
				if (results.code === "SUCCESS") {                
					$scope.product_prices  			= results.data;
					if (isEditMode == false) {
						$scope.sale.bill_number		= (results.last_bill_number['bill_number'] == null || results.last_bill_number['bill_number'] == undefined) ? 1 : parseInt(results.last_bill_number['bill_number']) + 1;
					}
				
					if ($scope.previewOnly) {
						$scope.sale_products      	= [];
						var input                    	= {};
						input["bill_number"]      	= billRecord.bill_number;
						input["bill_id"]         	= billRecord.id;
						$scope.promise              	= Data.post('BillingCtrl/getBillProducts', input).then(function(results) {                
							if (results.code === "SUCCESS") {
								if (results.data.length > 0) {
									$scope.replaceProductObject(results.data);
								}
							} 
						});
					}
				}
			});
		} else if (selectedOpt === "CUSTOMER" && selectedRecord != undefined) {
			$scope.form8bClass      = "previewWidth38Percent borderNone";
			input["customer_id"]    = selectedRecord["id"];
			input["type"]           = $scope.sale.type["id"]; 
			$scope.promise          = Data.post('BillingCtrl/prices', input).then(function(results) {
				if (results.code === "SUCCESS") {                
					$scope.product_prices  			= results.data;
					if (isEditMode == false) {
						$scope.sale.bill_number		= (results.last_bill_number['bill_number'] == null || results.last_bill_number['bill_number'] == undefined) ? 1 : parseInt(results.last_bill_number['bill_number']) + 1;
					}
					
					if ($scope.previewOnly) {
						$scope.sale_products      	= [];
						var input                    	= {};
						input["bill_number"]      	= billRecord.bill_number;
						input["bill_id"]         	= billRecord.id;
						$scope.promise              	= Data.post('BillingCtrl/getBillProducts', input).then(function(results) {                
							if (results.code === "SUCCESS") {
								if (results.data.length > 0) {
									$scope.replaceProductObject(results.data);
								}
							} 
						});
					}
				}
			});
		} else {
			$scope.form8bClass      	= "previewWidth38Percent borderNone";
			if (selectedRecord != undefined) {
				input["type"]       	= selectedRecord["id"]; 
				$scope.promise      	= Data.post('BillingCtrl/lastbillnumber', input).then(function(results) {
					if (results.code === "SUCCESS") {                
						if (isEditMode == false) {
							$scope.sale.bill_number	= (results.last_bill_number['bill_number'] == null || results.last_bill_number['bill_number'] == undefined) ? 1 : parseInt(results.last_bill_number['bill_number']) + 1;
						}
						
						if ($scope.previewOnly) {
							$scope.sale_products      	= [];
							var input                    	= {};
							input["bill_number"]      	= billRecord.bill_number;
							input["bill_id"]         	= billRecord.id;
							$scope.promise              	= Data.post('BillingCtrl/getBillProducts', input).then(function(results) {                
								if (results.code === "SUCCESS") {
									if (results.data.length > 0) {
										$scope.replaceProductObject(results.data);
									}
								} 
							});
						}
					} else {
						$scope.sale.bill_number		= 1;
					}
				});
			} else {
				if (isEditMode == false) {
					$scope.sale.bill_number 		= "";
				}
				
				if ($scope.previewOnly) {
					$scope.sale_products      	= [];
					var input                    	= {};
					input["bill_number"]      	= billRecord.bill_number;
					input["bill_id"]         	= billRecord.id;
					$scope.promise              	= Data.post('BillingCtrl/getBillProducts', input).then(function(results) {                
						if (results.code === "SUCCESS") {
							if (results.data.length > 0) {
								$scope.replaceProductObject(results.data);
							}
						} 
					});
				}
			}
		}
        };
        
        $scope.calculateKgTotal         = function(aPdt){
		var qnty		= (aPdt.quantity_kg != null && !isNaN(aPdt.quantity_kg)) ? aPdt.quantity_kg : 0;	
            //if (aPdt.quantity_kg != null && !isNaN(aPdt.quantity_kg)) {
                var kg_amount               = parseFloat(aPdt.price_per_kg) * parseFloat(qnty);
                aPdt.kg_amount              = parseFloat(Math.round(kg_amount * 100) / 100).toFixed(2);
                $scope.calculatePdtNetAmount(aPdt);
            //}
        };
        
        $scope.calculatePacketsTotal    = function(aPdt){
		var qnty		= (aPdt.quantity_packets != null && !isNaN(aPdt.quantity_packets)) ? aPdt.quantity_packets : 0;
            //if (aPdt.quantity_packets != null && !isNaN(aPdt.quantity_packets)) {
                var packets_amount          = parseFloat(aPdt.price_per_packet) * parseFloat(qnty);
                aPdt.packets_amount         = parseFloat(Math.round(packets_amount * 100) / 100).toFixed(2);
                $scope.calculatePdtNetAmount(aPdt);
            //}                
        };
        
        $scope.calculatePdtNetAmount    = function(aPdt){
            aPdt.kg_amount              = (aPdt.kg_amount != undefined) ? parseFloat(aPdt.kg_amount) : 0.00;
            aPdt.packets_amount         = (aPdt.packets_amount != undefined) ? parseFloat(aPdt.packets_amount) : 0.00;
            var net_amount              = aPdt.kg_amount + aPdt.packets_amount;
            aPdt.net_amount             = parseFloat(Math.round(net_amount * 100) / 100).toFixed(2);
            var tax_amount              = 0.00;
            if ($scope.customer.is_taxable['optId'] === "Y") {
                tax_amount	        = (aPdt.net_amount * parseFloat($scope.fin_year_info['tax_rate'])) / 100;
                aPdt.tax_amount         = parseFloat(Math.round(tax_amount * 100) / 100).toFixed(2);
            } else {
                aPdt.tax_amount         = tax_amount;
            }

            var total_amount            = parseFloat(aPdt.net_amount) + parseFloat(aPdt.tax_amount);
            aPdt.total_amount           = parseFloat(Math.round(total_amount * 100) / 100).toFixed(2);
            
            if (aPdt.total_amount > 0) {
                $scope.insertOrUpdatePdt(aPdt);
            } else {
                $scope.removePdt(aPdt);
            }
            
            $scope.calculateNetAmount();
        };
        
        $scope.calculateNetAmount       = function(){
            var pdtLen                  = $scope.product_prices.length;
            var aPdtRec                 = null;
            var net_amount              = 0;
            var tax_amount              = 0;
            var grand_total             = 0;
            for (var i = 0; i < pdtLen; i++){
                aPdtRec                 = $scope.product_prices[i];
                net_amount              += (aPdtRec.net_amount != undefined) ? parseFloat(aPdtRec.net_amount) : 0.00;
                tax_amount              += (aPdtRec.tax_amount != undefined && $scope.customer.is_taxable['optId'] === "Y") ? parseFloat(aPdtRec.tax_amount) : 0.00;
            }
            grand_total                 += parseFloat(net_amount) + parseFloat(tax_amount);
            if ($scope.adjustment != undefined) {
                grand_total             = parseFloat(grand_total) - parseFloat($scope.adjustment);
            }
            $scope.net_amount           = parseFloat(Math.round(net_amount * 100) / 100).toFixed(2);
            $scope.tax_amount           = parseFloat(Math.round(tax_amount * 100) / 100).toFixed(2);
            $scope.grand_total          = parseFloat(Math.round(grand_total * 100) / 100).toFixed(2);
            
            $scope.grand_total_in_words = toWords($scope.grand_total);
        };
        
        $scope.refreshAddedProducts     = function(){
            var pdtLen                  = $scope.sale_products.length;
            for (var i = 0; i < pdtLen; i++){
                aPdtRec                 = $scope.sale_products[i];
                $scope.calculatePdtNetAmount(aPdtRec);
            }
        };
        
        $scope.insertOrUpdatePdt        = function(aPdt){
            if ($scope.sale_products.length > 0) {
                //var addedPdtObj         = getActualPdtObject(aPdt, $scope.sale_products);
                var index 		= $scope.sale_products.indexOf(aPdt);
                if (index == -1) {
                    $scope.sale_products.push(aPdt);
                }
            } else {
                $scope.sale_products.push(aPdt);
            }
        };
        
        $scope.removePdt                = function(aPdt){
             var index 		        = $scope.sale_products.indexOf(aPdt);
             if (index != -1) {
                    $scope.sale_products.splice(index, 1);
            }
        };
        
        $scope.clearThisForm = function(){
	    $scope.sale_products        = [];
            $scope.product_prices       = [];
            $scope.net_amount           = "";
            $scope.tax_amount           = "";
            $scope.grand_total          = "";            
            $scope.grand_total_in_words = "";
            $scope.customer             = {};
            $scope.sale                 = {};
            $scope.sale.status          = $scope.statusOptions[0];
            $scope.sale.id              = "0";
            $scope.form8bClass          = "previewWidth38Percent borderNone";
            $scope.customer.is_taxable  = $scope.taxableOptions[0];
            $scope.cancelledWaterMark   = false;
            $scope.sale.bill_number     = "";
            $scope.msg                  = "";
            $scope.SalesFrm.$setPristine();
	    return false;
	};
        
        //$scope.drawWaterMark                = function(statusObj){
        //    if (statusObj['optId'] === "Cancelled") {
        //        $scope.cancelledWaterMark   = true;
        //    } else {
        //        $scope.cancelledWaterMark   = false;
        //    }            
        //};
        
        $scope.doManageSale                 = function () {
            $scope.delay                    = 0;
            $scope.minDuration              = 0;
            $scope.message                  = 'Please Wait...';
            $scope.backdrop                 = true;
            $scope.promise                  = null;
            var input                       = {};
            input["bill_number"]            = $scope.sale.bill_number;
            input["date"]                   = $scope.sale.date.getTime() / 1000;
            input["type"]                   = $scope.sale.type["id"];
            input["taxable"]                = $scope.customer.is_taxable['optId'];
            input["tax_percentage"]         = $scope.fin_year_info['tax_rate'];
            input["tax_amount"]             = $scope.tax_amount;
            input["net_amount"]             = $scope.net_amount;
            input["discount"]               = $scope.adjustment;
            input["total_amount"]           = $scope.grand_total;
            input["status"]                 = $scope.sale.status['optId'];
	    if ($scope.sale.type["id"] == 'Form No. 8' && $scope.customer.is_taxable['optId'] == 'N') {
		input["formh_received"]		=  ($scope.sale.formh_received != undefined && $scope.sale.formh_received != null) ? $scope.sale.formh_received : 'No';
	    } else {
		input["formh_received"]         =  'NA';
	    }            
            input["single_commodity_name"]  = $scope.customer.single_commodity_name;
            input["delivery_note"]          = $scope.sale.delivery_note;
            input["purchase_order"]         = $scope.sale.purchase_order;
            input["despatch_doc"]           = $scope.sale.despatch_doc;
            input["delivery_terms"]         = $scope.sale.delivery_terms;
            input["vehicle_number"]         = $scope.sale.vehicle_number;
            input["added_by"]               = localStorage.getItem("name");
            input["customer_id"]            = ($scope.customer.id != undefined) ? $scope.customer.id : 0;
            input["customer_name"]          = $scope.customer.name;
            input["customer_email"]         = $scope.customer.email;
            input["customer_address"]       = $scope.customer.fulladdress;
            input["customer_phone"]         = $scope.customer.phone;
            input["customer_mobile"]        = $scope.customer.mobile;
            input["customer_fax"]           = $scope.customer.fax;
            input["customer_vat_number"]    = $scope.customer.vat_number;
            input["customer_pin_number"]    = $scope.customer.pin_number;
            input["customer_cst_number"]    = $scope.customer.cst_number;
            input["profile_name"]           = $scope.profile.name;
            input["profile_email"]          = $scope.profile.email;
            input["profile_address"]        = $scope.profile.address;
            input["profile_city"]           = $scope.profile.city;
            input["profile_state"]          = $scope.profile.state;
            input["profile_pincode"]        = $scope.profile.pincode;
            input["profile_phone"]          = $scope.profile.phone;
            input["profile_mobile"]         = $scope.profile.mobile;
            input["profile_fax"]            = $scope.profile.fax;
            input["profile_tin_number"]     = $scope.profile.tin_number;
            input["id"]                     = $scope.sale.id;
            
            var pdtArray                    = [];
            if ($scope.sale_products != undefined && $scope.sale_products != null && $scope.sale_products.length > 0) {
                var arrLength                   = $scope.sale_products.length;
                var aRecord                     = null;
                var aPdtObject                  = null;
                for (var i = 0; i < arrLength; i++){
                    aRecord                     = {};
                    aPdtObject                  = $scope.sale_products[i];
                    aRecord['product_id']       = aPdtObject['product_id'];
                    aRecord['product_code']     = aPdtObject['code'];
                    aRecord['product_name']     = aPdtObject['name'];
                    aRecord['product_price']    = (aPdtObject['price_per_kg'] > 0) ? parseFloat(aPdtObject['price_per_kg']) : parseFloat(aPdtObject['price_per_packet']);
                    aRecord['quantity']         = (aPdtObject['quantity_kg'] > 0) ? aPdtObject['quantity_kg'] : aPdtObject['quantity_packets'];
                    aRecord['type']             = (aPdtObject['quantity_kg'] > 0) ? 'kg' : 'packet';                 
                    aRecord['quantity_per_packet']	= (aPdtObject['quantity_per_packet'] != undefined) ? aPdtObject['quantity_per_packet'] : 'NA'; 
		    aRecord['tax_amount']       = aPdtObject['tax_amount'];
                    aRecord['net_amount']       = aPdtObject['net_amount'];
                    aRecord['total_amount']     = aPdtObject['total_amount'];
                    pdtArray.push(aRecord);
                }
            }            
            input["sale_products"]          = pdtArray;
            
            $scope.promise                  = Data.post('BillingCtrl/manage', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    //$scope.msg              = "Record has been saved";
                    //$scope.msgSpanClass     = "messageSpan";
                    $scope.partner          = {};
                    $scope.SalesFrm.$setPristine();
                    //$scope.refreshSalesBillList();
		    $.confirm({
				'title'	 : 'Information',
				'message': "Record has been saved",
				'buttons': {
					'Yes': {
						'class' : 'blue',
						'action': function(){
							$scope.showBillListing();
						}
					}
				}
			});
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.getActualCustomerObject              = function(refObject, objectsArray){
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
        
        $scope.replaceProductObject                 	= function(objectsArray){
		var tempExistingPdts                    = $scope.product_prices;
		var tempPdtsLength                      = $scope.product_prices.length;
		var tempPdtObj                          = null;
		
		var addedPdtLen                         = objectsArray.length;
		var aPdtObj                             = null;
		
		var usedPdtsArray                       = [];
		var unUsedPdtsArray                     = [];
		
		var isUsedPdt                           = false;
            
		for (var i = 0; i < tempPdtsLength; i++){
			tempPdtObj                     	= $scope.product_prices[i];
			isUsedPdt                	= false;
			for (var j = 0; j < addedPdtLen; j++){
				aPdtObj                         	= objectsArray[j];
				if (aPdtObj.product_id == tempPdtObj.product_id) {
					isUsedPdt                      	= true;					
					tempPdtObj["quantity_kg"]       = (parseFloat(tempPdtObj.price_per_kg) != 0.00) ? parseFloat(aPdtObj["quantity"]) : 0;
					tempPdtObj["quantity_packets"]  = (parseFloat(tempPdtObj.price_per_packet) != 0.00) ? parseFloat(aPdtObj["quantity"]) : 0;
					tempPdtObj["price_per_kg"]      = (parseFloat(tempPdtObj.price_per_kg) != 0.00) ? parseFloat(aPdtObj["price"]) : 0.00;
					tempPdtObj["price_per_packet"]  = (parseFloat(tempPdtObj.price_per_packet) != 0.00) ? parseFloat(aPdtObj["price"]) : 0.00;
					
					tempPdtObj["quantity_per_packet"]  = (aPdtObj.quantity_per_packet != undefined) ? aPdtObj.quantity_per_packet : "NA";
					
					var kg_amount               	= parseFloat(tempPdtObj["price_per_kg"]) * parseFloat(aPdtObj["quantity"]);
					tempPdtObj["kg_amount"]         = parseFloat(Math.round(kg_amount * 100) / 100).toFixed(2);
					var packets_amount          	= parseFloat(tempPdtObj["price_per_packet"]) * parseFloat(aPdtObj["quantity"]);
					tempPdtObj["packets_amount"]    = parseFloat(Math.round(packets_amount * 100) / 100).toFixed(2);
					
					tempPdtObj["pdt_amount"]        = (aPdtObj["net_amount"]);
					tempPdtObj["net_amount"]        = (aPdtObj["net_amount"]);
					tempPdtObj["tax_amount"]        = (aPdtObj["tax_amount"]);
					tempPdtObj["total_amount"]      = (aPdtObj["total_amount"]);
					break;
				}
			}
                
			if (isUsedPdt) {
				usedPdtsArray.push(tempPdtObj);
				$scope.sale_products.push(tempPdtObj);
			} else {
				unUsedPdtsArray.push(tempPdtObj);
			}
		}
            
		$scope.product_prices                   = [];
		$scope.product_prices                   = usedPdtsArray.concat(unUsedPdtsArray);
        };
	
	
	$scope.showBillListing				= function(){
		UserService.selectedSaleBill		= null;
		$location.path("/salebills");
		$route.reload();
	};
	
	$scope.printThisBill          			= function(selRecord){
            //UserService.selectedSaleBill		= selRecord;
            //$location.path("/viewbill");
	    window.print();
        };
	
	$scope.editThisBill          			= function(){
		var elem 				= $(this).closest('.table');
		$.confirm({
			'title'	 : 'Edit Confirmation',
			'message': "Are you sure, you want to edit this record?",
			'buttons': {
				'Yes': {
					'class' : 'blue',
					'action': function(){
						$scope.previewOnly			= false;
						$location.path("/managebill");
						$route.reload();
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
	
	$scope.deleteThisBill  				= function () {
		if (UserService.selectedSaleBill != undefined && UserService.selectedSaleBill != null) {
			var selRecord           	= UserService.selectedSaleBill;
			var elem 			= $(this).closest('.table');
			$.confirm({
				'title'	 : 'Delete Confirmation',
				'message': 'Are you sure, you want to delete this record?',
				'buttons': {
					'Yes': {
						'class' : 'blue',
						'action': function(){
							//$scope.clearThisForm();
							var input           	= {};
							input["bill_id"]    	= selRecord.id;
							input["bill_number"]	= selRecord.bill_number;
							input["type"]		= selRecord.type;
							$scope.promise      	= Data.post('BillingCtrl/delete', input).then(function (results) {                
								if (results.code === "SUCCESS") {
									$.confirm({
										'title'	 : 'Information',
										'message': 'Record has been deleted',
										'buttons': {
											'Yes': {
												'class' : 'blue',
												'action': function(){
													$scope.showBillListing();
												}
											}
										}
									});	
								} else {
									$.confirm({
										'title'	 : 'Information',
										'message': 'Unable to delete this record!!!',
										'buttons': {
											'Yes': {
												'class' : 'blue',
												'action': function(){
													$scope.showBillListing();
												}
											}
										}
									});
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
		} else {
			$.confirm({
				'title'	 : 'NGS',
				'message': "Can't delete this record!!!",
				'buttons': {
					'Yes': {
						'class' : 'blue',
						'action': function(){
							$scope.showBillListing();
						}
					}
				}
			});			
		}
        };
    }
]);