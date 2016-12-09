angular.module('mealimeterApp')
    .controller('ringerCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {
        if ($localStorage.data == undefined) {
            $localStorage.guest = true;
        }

        if ($localStorage.guest == true) {
            $scope.username = "guest";
            $scope.companysubsidy = 0;
            var data = "guest=guest";
        } else {
            var data = "token=" + $localStorage.data.data.token;
            $scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
            $scope.username = $localStorage.data.data.username;
        }
        $scope.discount = 0;

        var link = $rootScope.mealimeter;
        $http({
            method: "POST",
            url: link + "getmealspreorder",
            data: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).then(function(result) {
            console.log(result);
            if (result.data.description == "Already Preordered") {
                $scope.done = false;
                $scope.notdone = true;
            } else {

                $scope.meals = result.data.preorderList;
                $scope.drinks = result.data.drinks;
            }
        }, function(error) {
            console.log(error);
        });

        $scope.redirectToCart = function() {
            $timeout(function() {
                $window.location.href = "#/pre-order/thursday";
            }, 500)
        }

    }]);