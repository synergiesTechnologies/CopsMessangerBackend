myAppControllers.controller('StatisticsCntrl', ['$scope', '$location', '$rootScope', 'Data', 'UserService', '$route', function($scope, $location, $rootScope, Data, UserService, $route) {
        $scope.delay                	= 0;
	$scope.minDuration          	= 0;
	$scope.message              	= 'Please Wait...';
	$scope.backdrop             	= true;
        $scope.promise              	= null;
        $scope.statisticsSummary        = [];
        
        $scope.refreshStatisticsStats	                = function () {
                $scope.statisticsSummary                = [];
                $scope.monthsTopFourCustomers           = [];
                $scope.monthsTopFourProducts            = [];
                $scope.recentFiveBills                  = [];
                $scope.promise                          = Data.get('StatisticsCtrl/statisticsstats').then(function(results) {
                        var chartMonthLabels            = $scope.chartMonthLabels();
                        var colChartSaleData            = $scope.formatChartData(results.monthlySales);
                        var colChartPurchaseData        = $scope.formatChartData(results.monthlyPurchase);
                        var colChartSaleForm8Data       = $scope.formatChartDataAndSum(results.monthlySalesForm8);
                        var colChartSaleForm8BData      = $scope.formatChartDataAndSum(results.monthlySalesForm8B);
                        var pieChartSalesBillTypeData   = [];
                        pieChartSalesBillTypeData.push({"name": "Sale - Form 8", "y": parseFloat(colChartSaleForm8Data['sum']), "color":"rgb(102, 158, 88)"});
                        pieChartSalesBillTypeData.push({"name": "Sale - Form 8B", "y": parseFloat(colChartSaleForm8BData['sum']), "color":"rgb(102, 128, 88)"});
                        var colChartOptions             = {     chart           : {type: 'column'},
                                                                title           : {text: ''},
                                                                subtitle        : {text: ''},
                                                                xAxis           : {categories: chartMonthLabels, crosshair: true},
                                                                yAxis           : {min: 0, title: { text: 'Amount (Rs)'}},
                                                                tooltip         : {headerFormat    : '<span style="font-size:10px">{point.key}</span><table>',
                                                                                   pointFormat     : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                                                                     '<td style="padding:0"> Rs <b>{point.y:.2f}</b></td></tr>',
                                                                                   footerFormat    : '</table>',
                                                                                   shared          : true,
                                                                                   useHTML         : true
                                                                                  },
                                                                plotOptions     : {column: {stacking: 'normal', pointPadding: 0.2, borderWidth: 0}},
                                                                series          : [{type:'column', name: 'Sale - Form 8', data: colChartSaleForm8Data['data'], color:'rgb(102, 158, 88)'},
                                                                                   {type:'column', name: 'Sale - Form 8B', data: colChartSaleForm8BData['data'], color:'rgb(102, 128, 88)'},
                                                                                   {type:'line', name: 'Total Sales', data: colChartSaleData, color:'rgb(102, 218, 88)'},
                                                                                   {type:'line', name: 'Total Purchases', data: colChartPurchaseData, color:'rgb(70, 222, 222)'},
                                                                                   {type:'pie', name: 'Amount', data: pieChartSalesBillTypeData, center: ['90%', '15%'], size: 80, showInLegend: false, allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '{point.name}<br>Rs {point.y:.2f}'}},
                                                                                  ],
                                                                credits         : {enabled: false}
                                                        };
                        $('#colChartContainer').highcharts(colChartOptions);
                        
                        var colorOptions                = ["rgb(224, 76, 76)", "rgb(105, 129, 236)", "rgb(92, 193, 228)", "rgb(198, 241, 96)", "rgb(236, 194, 110)", "rgb(102, 226, 134)"];

                        var linChartSeriesDataSale      = [];
                        if (results.wholeSalesDetails != undefined && results.wholeSalesDetails != null && results.wholeSalesDetails.length > 0) {
                                var wholeSalesLen       = results.wholeSalesDetails.length;
                                var aSaleDetailsObj     = null;
                                var lineChartData       = null;
                                for (var i = 0; i < wholeSalesLen; i++){
                                        aSaleDetailsObj         = results.wholeSalesDetails[i];
                                        lineChartData           = {};
                                        lineChartData["name"]   = aSaleDetailsObj["title"];
                                        lineChartData["data"]   = $scope.formatChartData(aSaleDetailsObj["data"]);
                                        lineChartData["color"]  = colorOptions[i];
                                        linChartSeriesDataSale.push(lineChartData);
                                }
                        }
                        
                        var linChartOptionsSale         = {     chart           : {type: 'line'},
                                                                title           : {text: ''},
                                                                subtitle        : {text: ''},
                                                                xAxis           : {categories: chartMonthLabels, crosshair: true},
                                                                yAxis           : {min: 0, title: { text: 'Amount (Rs)'}},
                                                                tooltip         : {headerFormat    : '<span style="font-size:10px">{point.key}</span><table>',
                                                                                   pointFormat     : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                                                                     '<td style="padding:0"> Rs <b>{point.y:.2f}</b></td></tr>',
                                                                                   footerFormat    : '</table>',
                                                                                   shared          : true,
                                                                                   useHTML         : true
                                                                                  },
                                                                plotOptions     : {line: {dataLabels: {enabled: false}}},
                                                                series          : linChartSeriesDataSale,
                                                                credits         : {enabled: false}
                                                        };
                        $('#linChartContainerSale').highcharts(linChartOptionsSale);                        
                                                
                        var linChartSeriesDataPurchase   = [];
                        if (results.wholePurchaseDetails != undefined && results.wholePurchaseDetails != null && results.wholePurchaseDetails.length > 0) {
                                var wholePurchaseLen    = results.wholePurchaseDetails.length;
                                var aPurchaseDetailsObj = null;
                                var lineChartData       = null;
                                for (var i = 0; i < wholePurchaseLen; i++){
                                        aPurchaseDetailsObj     = results.wholePurchaseDetails[i];
                                        lineChartData           = {};
                                        lineChartData["name"]   = aPurchaseDetailsObj["title"];
                                        lineChartData["data"]   = $scope.formatChartData(aPurchaseDetailsObj["data"]);
                                        lineChartData["color"]  = colorOptions[i];
                                        linChartSeriesDataPurchase.push(lineChartData);
                                }
                        }
                        var linChartOptionsPurchase     = {     chart           : {type: 'line'},
                                                                title           : {text: ''},
                                                                subtitle        : {text: ''},
                                                                xAxis           : {categories: chartMonthLabels, crosshair: true},
                                                                yAxis           : {min: 0, title: { text: 'Amount (Rs)'}},
                                                                tooltip         : {headerFormat    : '<span style="font-size:10px">{point.key}</span><table>',
                                                                                   pointFormat     : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                                                                     '<td style="padding:0"> Rs <b>{point.y:.2f}</b></td></tr>',
                                                                                   footerFormat    : '</table>',
                                                                                   shared          : true,
                                                                                   useHTML         : true
                                                                                  },
                                                                plotOptions     : {line: {dataLabels: {enabled: false}}},
                                                                series          : linChartSeriesDataPurchase,
                                                                credits         : {enabled: false}
                                                        };
                        $('#linChartContainerPurchase').highcharts(linChartOptionsPurchase);
                        
                        var pieChartSeriesDataSale      = [];
                        var pieChartData                = {};
                        pieChartData["name"]            = "Sale Amount";
                        pieChartData["colorByPoint"]    = true;
                        pieChartData["data"]            = [];
                        if (results.totalSale != undefined && results.totalSale != null && results.totalSale.length > 0) {
                                var arrayLen            = results.totalSale.length;
                                var anItemObj           = null;
                                
                                var aChartData          = null;
                                for (var i = 0; i < arrayLen; i++){
                                        anItemObj               = results.totalSale[i];
                                        aChartData              = {};
                                        aChartData["name"]      = anItemObj["title"];
                                        aChartData["y"]         = parseFloat(anItemObj["data"]["total"]);
                                        aChartData["color"]     = colorOptions[i];
                                        if (i == (arrayLen -1)) {
                                                aChartData["sliced"]    = true;
                                                aChartData["selected"]  = true;
                                        }
                                        
                                        pieChartData["data"].push(aChartData);
                                }
                                /*for (var i = 0; i < arrayLen; i++){
                                        anItemObj               = results.totalSale[i];
                                        
                                        if (i == (arrayLen -1)) {
                                                aChartData              = {};
                                                aChartData["sliced"]    = true;
                                                aChartData["selected"]  = true;
                                                aChartData["name"]      = anItemObj["title"];
                                                aChartData["y"]         = parseFloat(anItemObj["data"]["total"]);
                                                aChartData["color"]     = colorOptions[i];
                                        } else {
                                               aChartData               = [];
                                               aChartData.push(anItemObj["title"]);
                                               aChartData.push(parseFloat(anItemObj["data"]["total"]));
                                               aChartData.push(colorOptions[i]);
                                        }
                                        
                                        pieChartData["data"].push(aChartData);
                                }*/
                        }
                        pieChartSeriesDataSale.push(pieChartData);
                        var pieChartOptionsSale         = {     chart           : {type: 'pie'},
                                                                title           : {text: ''},
                                                                subtitle        : {text: ''},
                                                                tooltip         : {pointFormat: '{point.percentage:.1f} %'},
                                                                plotOptions     : {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '{point.name}<br>Rs {point.y:.2f}'}, showInLegend: true}},
                                                                series          : pieChartSeriesDataSale,
                                                                credits         : {enabled: false}
                                                        };
                        $('#pieChartContainerSale').highcharts(pieChartOptionsSale);                       
                        
                        var pieChartSeriesDataPurchase  = [];
                        var pieChartData                = {};
                        pieChartData["name"]            = "Purchase Amount";
                        pieChartData["colorByPoint"]    = true;
                        pieChartData["data"]            = [];
                        if (results.totalPurchase != undefined && results.totalPurchase != null && results.totalPurchase.length > 0) {
                                var arrayLen            = results.totalPurchase.length;
                                var anItemObj           = null;
                                
                                var aChartData          = null;
                                for (var i = 0; i < arrayLen; i++){
                                        anItemObj               = results.totalPurchase[i];
                                        aChartData              = {};
                                        aChartData["name"]      = anItemObj["title"];
                                        aChartData["y"]         = parseFloat(anItemObj["data"]["total"]);
                                        aChartData["color"]     = colorOptions[i];
                                        if (i == (arrayLen -1)) {
                                                aChartData["sliced"]    = true;
                                                aChartData["selected"]  = true;
                                        }
                                        
                                        pieChartData["data"].push(aChartData);
                                }
                        }
                        pieChartSeriesDataPurchase.push(pieChartData);
                        var pieChartOptionsPurchase     = {     chart           : {type: 'pie'},
                                                                title           : {text: ''},
                                                                subtitle        : {text: ''},
                                                                tooltip         : {pointFormat: '{point.percentage:.1f} %'},
                                                                plotOptions     : {pie: {allowPointSelect: true, cursor: 'pointer', dataLabels: {enabled: true, format: '{point.name}<br>Rs {point.y:.2f}'}, showInLegend: true}},
                                                                series          : pieChartSeriesDataPurchase,
                                                                credits         : {enabled: false}
                                                        };
                        $('#pieChartContainerPurchase').highcharts(pieChartOptionsPurchase);
                });
        };
        
        $scope.refreshStatisticsStats();
        $rootScope.$broadcast('BrowserRefreshed', "STATS");
        
        $scope.getMonthsInFinYearOrder  = function() {
                var months  = [];
                months.push({"num":"4", "name":"Apr"});
                months.push({"num":"5", "name":"May"});
                months.push({"num":"6", "name":"Jun"});
                months.push({"num":"7", "name":"Jul"});
                months.push({"num":"8", "name":"Aug"});
                months.push({"num":"9", "name":"Sep"});
                months.push({"num":"10", "name":"Oct"});
                months.push({"num":"11", "name":"Nov"});
                months.push({"num":"12", "name":"Dec"});
                months.push({"num":"1", "name":"Jan"});
                months.push({"num":"2", "name":"Feb"});
                months.push({"num":"3", "name":"Mar"});
                return months;
        };
        
        $scope.getMonthValue  = function(monthNum, valueArray) {
                var returnVal           = 0;
                if (valueArray != undefined && valueArray != null && valueArray.length > 0) {
                        var arrLen      = valueArray.length;
                        var aRecord     = null;
                        for (var i = 0; i < arrLen; i++){
                                aRecord = valueArray[i];
                                if (aRecord['monthNum'] == monthNum) {
                                        returnVal       = parseFloat(aRecord['total']);
                                        break;
                                }
                        }
                }
                return returnVal;
        };
        
        $scope.formatChartData                  = function(dataPonits) {
                var finYrMonths                 = $scope.getMonthsInFinYearOrder();
                var chartData                   = [];
                for (var i = 0; i < 12; i++){
                        aMonth                  = finYrMonths[i];
                        chartData.push($scope.getMonthValue(aMonth['num'], dataPonits));
                }
                return chartData;
        };
        
        $scope.formatChartDataAndSum            = function(dataPonits) {
                var finYrMonths                 = $scope.getMonthsInFinYearOrder();
                var returnVal                   = {};
                var chartData                   = [];
                var sum                         = 0;
                var amount                      = 0;
                for (var i = 0; i < 12; i++){
                        aMonth                  = finYrMonths[i];
                        amount                  = $scope.getMonthValue(aMonth['num'], dataPonits);
                        chartData.push(amount);
                        sum                     = sum + parseFloat(amount);
                }
                returnVal["data"]               = chartData;
                returnVal["sum"]                = sum;
                return returnVal;
        };
        
        $scope.chartMonthLabels                 = function() {
                var finYrMonths                 = $scope.getMonthsInFinYearOrder();
                var chartLabels                 = [];
                for (var i = 0; i < 12; i++){
                        aMonth                  = finYrMonths[i];
                        chartLabels.push(aMonth['name']);
                }
                return chartLabels;
        };

}]);