myAppControllers.controller('TemplateCntrl', ['$scope', '$routeParams', function($scope, $routeParams) {
        $scope.navbarPath = function () {
            var name    = localStorage.getItem("name");
            //console.log(name);
            if (name == undefined || name == null) {
                return "partials/navbar_outer.html";
            } else {
                return "partials/navbar_inner.html";        
            }
        }
        
        $scope.navsubbarPath = function () {
            var name    = localStorage.getItem("name");
            if (name == undefined || name == null) {
                return "";
            } else {
                return "partials/navsubbar_inner.html";        
            }
        } 
    }
]);