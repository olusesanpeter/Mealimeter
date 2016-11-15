angular.module('mealimeterApp')
    .controller('homeCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {

        $scope.goto2Rice = function() {
            $localStorage.preload = [
                [2, 3],
                [3, 1]
            ];
            $localStorage.preDiscount = 3000;

            $window.location.href = "#/pre-order/monday";
        }

        $scope.gotoCombo = function() {
            $localStorage.preload = [];

            $window.location.href = "#/pre-order/monday";
        }

    }]);