/* Controllers Continue...*/

myAppControllers.controller('BackupsCntrl', ['$scope', '$location', '$rootScope', 'Data', function($scope, $location, $rootScope, Data) {
        $scope.delay                = 0;
	$scope.minDuration          = 0;
	$scope.message              = 'Please Wait...';
	$scope.backdrop             = true;
        $scope.promise              = null;        
        $scope.records              = [];
        $scope.msg                  = "";
	$scope.pageSize             = 10;
        $scope.filterKey            = "";
	$scope.currentPage	    = 1;
        $scope.backup               = {};
	$rootScope.$broadcast('BrowserRefreshed', "BACKUP");
        
        $scope.refreshBackupList        = function() {
	    $scope.backup               = {};
            $scope.backup.id            = "0";
            $scope.promise              = Data.post('SettingsCtrl/backuprecords').then(function (results) {
                if (results.code === "SUCCESS") {                
                    $scope.records          = results.data;                    
                }
            });
        };
        
        $scope.refreshBackupList();
        
        $scope.doManageBackup   = function () {
            $scope.delay        = 0;
            $scope.minDuration  = 0;
            $scope.message      = 'Please Wait...';
            $scope.backdrop     = true;
            $scope.promise      = null;
            var input           = {};
            input["name"]       = $scope.backup.name;
            input["id"]         = $scope.backup.id;
	    $scope.msg          = "";
            $scope.promise      = Data.post('SettingsCtrl/createbackup', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "Record has been saved";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.backup           = {};
                    $scope.BackupFrm.$setPristine();
                    $scope.refreshBackupList();
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        };
        
        $scope.doDownloadBackup  = function (selRecord) {
            $scope.delay        = 0;
            $scope.minDuration  = 0;
            $scope.message      = 'Please Wait...';
            $scope.backdrop     = true;
            $scope.promise      = null;
            var input           = {};
            input["file"]       = selRecord.file;
	    $scope.msg          = "";
            $scope.promise      = Data.post('SettingsCtrl/downloadbackup', input).then(function(results) {                
                if (results.code === "SUCCESS") {
                    $scope.msg              = "";
                    $scope.msgSpanClass     = "messageSpan";
                    $scope.backup           = {};
                } else {
                    $scope.msg              = results.message;
                    $scope.msgSpanClass     = "errorSpan";
                }
            });
        }
        
        $scope.doDeleteBackup  = function (selRecord) {
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
                                        input["file"]       = selRecord.file;
					$scope.promise      = Data.post('SettingsCtrl/deletebackup', input).then(function (results) {                
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
        
        $scope.doSearchBackup  = function () {
            var input           = {};
            input["keyword"]    = $scope.backup.keyword;
            $scope.promise      = Data.post('SettingsCtrl/backuprecords', input).then(function (results) {
                if (results.code === "SUCCESS") {                
                    $scope.records  = results.data;
                } else {
                    
                }
            });
        };
	
	$scope.clearThisForm = function(){
	    $scope.backup.name          = "";
	    $scope.backup.id		= "0";
	    $scope.msg                  = "";
	    $scope.BackupFrm.$setPristine();
	    return false;
	};
    }
]);
