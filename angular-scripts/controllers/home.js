angular.module('mealimeterApp')
    .controller('homeCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {

        $scope.createCombo = function(image) {
            $localStorage.preClean = true;
            $scope.gotoCombo(image);
        }

        $scope.gotoCombo = function(image, comboid) {
            if (comboid) {
                $localStorage.preload = [
                    [comboid, 1]
                ];
            }
            $localStorage.preImage = image;

            $window.location.href = "#/pre-order/thursday";
        }

    }]);