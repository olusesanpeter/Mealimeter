angular.module('mealimeterApp')
    .controller('ringerCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {
        if ($localStorage.data == undefined) {
            $localStorage.guest = true;
        }

        $scope.day = 0;
        console.log($localStorage.ringercart);
        if ($localStorage.ringercart == undefined) {
            $localStorage.ringercart = [];
            $localStorage.ringertotal = [];
            $localStorage.ringerdue = [];
            $scope.cart = [];
            $scope.total = 0;
            $scope.due = 0;
        } else {
            $scope.cart = $localStorage.ringercart;
            console.log($scope.cart);
            $scope.total = $localStorage.ringertotal;
            $scope.due = $localStorage.ringerdue;
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

        $scope.cart = [];


        $scope.addToCart = function(fooditem) {
            var option = {
                id: fooditem.id,
                mainmeal: fooditem.main,
                additive: fooditem.name,
                price: fooditem.price,
                quantity: 1,
                food: fooditem
            }

            var first_time = true;
            var already_id = null;

            //Check if the item already existed
            for (var i = 0; i < $scope.cart.length; i++) {
                if (option.id === $scope.cart[i].id) {
                    first_time = false;
                    already_id = i;
                }
            }
            var quantity = 0;
            //if it doesnt exist add to cart for the first time
            if (first_time) {
                quantity = 1;
                $scope.cart.push(option);
            }
            //else just increase the quantity and price of the old one 
            else {
                var olditem = $scope.cart[already_id];
                var newquantity = olditem.quantity + 1;
                olditem.price = (olditem.price / olditem.quantity) * newquantity;
                olditem.quantity = newquantity;
                quantity = newquantity;
                $scope.cart[already_id] = olditem;
            }

            $scope.recalculateTotal(fooditem.price);
            toastr.success(quantity + "x " + fooditem.name + " has been added to cart", "Added to cart");
        }

        $scope.removeFromCart = function(fooditem) {
            var exist = false;
            var already_id = null;

            //Check if the item already existed
            for (var i = 0; i < $scope.cart.length; i++) {
                if (fooditem.id === $scope.cart[i].id) {
                    exist = true;
                    already_id = i;
                }
            }

            //if it exist
            if (exist) {
                var olditem = $scope.cart[already_id];
                //if the quantity is more than one remove only one quantity and reduce price
                if (olditem.quantity > 1) {
                    var newquantity = olditem.quantity - 1;
                    olditem.price = (olditem.price / olditem.quantity) * newquantity;
                    olditem.quantity = newquantity;
                    $scope.cart[already_id] = olditem;
                    toastr.warning("One quantity of " + fooditem.name + " has been removed to cart. " + newquantity + "x remaining", "Removed from cart");
                }
                //else remove the whole thing
                else {
                    $scope.cart.splice(already_id, 1);
                    toastr.error(fooditem.name + " has been removed from cart", "removed from cart");
                }
                $scope.recalculateTotal(-fooditem.price);
            } else {
                toastr.info("it wasn't in the cart");
            }
        }

        $scope.recalculateTotal = function(newPrice) {
            $scope.total += Number.parseInt(newPrice);
            console.log(newPrice);
            $scope.due = $scope.total;

            $localStorage.ringercart = $scope.cart;
            $localStorage.ringertotal = $scope.total;
            $localStorage.ringerdue = $scope.due;
            console.log($localStorage.ringercart);

        }

    }]);