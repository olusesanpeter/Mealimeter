angular.module('mealimeterApp')
    .controller('home2Ctrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {
        if ($localStorage.data == undefined) {
            $localStorage.guest = true;
        }

        $scope.createCombo = function(image) {
            // $localStorage.preClean = true;
            $scope.gotoCombo(image);
        }

        $scope.slideDown = function() {
            console.log(6567);

            $('html, body').animate({
                scrollTop: '+=650px'
            }, 800);
        }

        $scope.showTeamModal = function() {
            $("#teamcmodal").modal();
        }

        $scope.gotoCart = function(image, comboid) {
            $localStorage.preImage = image;

            $localStorage.comboid = comboid;
            $scope.redirectToCart();
        }

        $scope.gotoCombo = function(image, comboid, foodnum, refer, referitem, drinknum, drinksize) {
            $("#sdmodal").modal('hide');
            $("#teammodal").modal('hide');

            $localStorage.comboid = comboid;

            if (comboid) {
                $localStorage.preload = [
                    [comboid, foodnum]
                ];
            } else {
                delete $localStorage.preload;
            }

            if (refer > 0) {
                $localStorage.preRefer = refer;
                $localStorage.preReferItem = referitem;
            } else {
                delete $localStorage.preRefer;
                delete $localStorage.preReferItem;
            }

            if (drinknum > 0) {
                $localStorage.preDrinknum = drinknum;
                $localStorage.preDrinksize = drinksize;
            } else {
                delete $localStorage.preDrinknum;
                delete $localStorage.preDrinksize;
            }

            $localStorage.preImage = image;

            $scope.redirectToCart();
        }

        $scope.redirectToCart = function() {
            $timeout(function() {
                $window.location.href = "#/pre-order/tuesday";
            }, 500)
        }

    }]);