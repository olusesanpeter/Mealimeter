'use strict';


angular.module('mealimeterApp')
    .controller('EventCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$routeParams', function($scope, $http, $rootScope, $window, $localStorage, $location, $routeParams) {

        if ($routeParams.tag) {
            $scope.eventTag = $routeParams.tag;
        }

        $scope.foodlist = [];
        $scope.fSelect = [];

        var link = $rootScope.mealimeter;
        $http({
            method: "POST",
            url: link + "order/getEventOrder?tag=" + $scope.eventTag,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).then(function(result) {
            if (result.data.error == false) {
                $scope.foodlist = result.data.result;
                console.log($scope.foodlist);
                var fls = $scope.foodlist.foods;

                fls.forEach(function(fl) {
                    $scope.fSelect[fl.id] = 0;
                }, this);
            } else {
                alert("something went wrong");
            }
        }, function(error) {
            console.log(error);
        });

        $scope.foodNum = function(num) {
            var numarray = [];
            for (var i = 1; i <= num; i++) {
                numarray.push(i);
            }

            return numarray;
        }

        $scope.confirmSelection = function() {
            if ($localStorage.guest == true) {
                swal({
                    title: "You must be logged in!",
                    text: $localStorage.msg + extraText,
                    html: true
                });

            } else {

                swal({
                    title: "Your selection has been noted!",
                    html: true
                });
            }

        }

    }]);