angular.module('mealimeterApp')
    .controller('homeCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {

        $scope.createCombo = function(image) {
            $localStorage.preClean = true;
            $scope.gotoCombo(image);
        }

        $scope.gotoCombo = function(image, comboid, refer, referitem) {
            if (comboid) {
                $localStorage.preload = [
                    [comboid, 1]
                ];
            }
            if (refer > 0) {
                $localStorage.preRefer = refer;
                $localStorage.preReferItem = referitem;
            } else {
                delete $localStorage.preRefer;
                delete $localStorage.preReferItem;
            }
            $localStorage.preImage = image;

            $window.location.href = "#/pre-order/thursday";
        }

    }]);