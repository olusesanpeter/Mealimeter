'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('preorderCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', function($scope, $http, $rootScope, $window, $localStorage, $location) {
        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $window.location.href = "#/login";
        } else {
            if ($location.path().split('/')[2] == "monday") {
                $scope.day = 0;
                $scope.daytext = "Monday";
            } else if ($location.path().split('/')[2] == "tuesday") {
                $scope.day = 1;
                $scope.daytext = "Tuesday";
            } else if ($location.path().split('/')[2] == "wednesday") {
                $scope.day = 2;
                $scope.daytext = "Wednesday";
            } else if ($location.path().split('/')[2] == "thursday") {
                $scope.day = 3;
                $scope.daytext = "Thursday";
            } else if ($location.path().split('/')[2] == "friday") {
                $scope.day = 4;
                $scope.daytext = "Friday";
            } else {
                $window.location.href = "#/pre-order/monday";
            }
            toastr.options.timeOut = 1000;
            toastr.positionClass = "toast-bottom-left";



            $scope.drinks = [];
            $scope.snacks = [];
            $scope.food = [];
            $scope.done = true;
            $scope.notdone = false;
            $scope.total = 0;


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
                // console.log(result.data);
                if (result.data.description == "Already Preordered") {
                    $scope.done = false;
                    $scope.notdone = true;
                } else {
                    $scope.meals = result.data.preorderList;
                    $scope.snacks = result.data.snacks;
                    $scope.drinks = result.data.drinks;
                    $scope.food = result.data.food;
                    console.log(result.data);
                    $scope.done = true;
                    $scope.notdone = false;

                    $scope.loadPreloads();
                }
            }, function(error) {
                console.log(error);
            });

            if ($localStorage.preload != undefined) {
                delete $localStorage.cart;
            }


            if ($localStorage.cart == undefined) {
                $localStorage.cart = [];
                $localStorage.total = [];
                $localStorage.due = [];
                $scope.cart = [];
                $scope.total = 0;
                $scope.due = 0;
                $scope.one = "none";
                $scope.two = "block";
            } else {
                if ($localStorage.cart[$scope.day] == undefined) {
                    $localStorage.cart[$scope.day] = [];
                    $localStorage.total[$scope.day] = 0;
                    $localStorage.due[$scope.day] = 0;
                    $scope.cart = [];
                    $scope.total = 0;
                    $scope.due = 0;
                    $scope.one = "none";
                    $scope.two = "block";
                } else {
                    $scope.cart = $localStorage.cart[$scope.day];
                    $scope.total = $localStorage.total[$scope.day];
                    $scope.due = $localStorage.due[$scope.day];
                    console.log($scope.due);
                    $scope.due = $scope.due - $scope.discount;
                    console.log($scope.due);
                    $scope.one = "block";
                    $scope.two = "none";
                }
            }

            $scope.recalculateTotal = function(newPrice) {
                $scope.total += Number.parseInt(newPrice);
                $scope.due = $scope.total - $scope.companysubsidy;
                $scope.due = $scope.due - $scope.discount;
                $localStorage.cart[$scope.day] = $scope.cart;
                $localStorage.total[$scope.day] = $scope.total;
                $localStorage.due[$scope.day] = $scope.due;
                $scope.empty = false;
                $scope.one = "block";
                $scope.two = "none";
            }

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
                    console.log(option);
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

            // $scope.addtocart = function(id, len) {
            //     var main = $scope.meals[$scope.day].options[len].option.name;
            //     var additive = $scope.meals[$scope.day].options[len].option.additives[id];
            //     var price = $scope.meals[$scope.day].options[len].option.prices[id];
            //     if (len == 0) {
            //         var newid = (len + 1) * (id + 1);
            //     } else {
            //         var prevsize = 0;
            //         for (var i = 0; i < len; i++) {
            //             prevsize += $scope.meals[$scope.day].options[i].option.additives.length;
            //         }
            //         var newid = prevsize + (id + 1);
            //     }
            //     var t = false;
            //     var currentposition = 0;
            //     var total = 0;

            //     for (var i = 0; i < $scope.cart.length; i++) {
            //         if (newid == $scope.cart[i].id) {
            //             t = true;
            //             currentposition = i;
            //         }
            //         total += Number.parseInt($scope.cart[i].price);
            //     }
            //     if (t == false) {
            //         $scope.cart.push({ 'id': newid, 'mainmeal': main, 'additive': additive, 'price': price, 'quantity': 1 });
            //         total += Number.parseInt(price);
            //     } else {
            //         var oldquantity = $scope.cart[currentposition].quantity;
            //         var newquantity = oldquantity + 1;
            //         var oldprice = $scope.cart[currentposition].price;
            //         var newprice = ((oldprice) / oldquantity) * newquantity;
            //         total = total - oldprice + newprice;
            //         $scope.cart[currentposition] = { 'id': newid, 'mainmeal': main, 'additive': additive, 'price': newprice, 'quantity': newquantity };
            //     }
            //     $scope.total = total;
            //     $scope.due = $scope.total - $scope.companysubsidy;
            //     $scope.due = $scope.due - $scope.discount;
            //     $localStorage.cart[$scope.day] = $scope.cart;
            //     $localStorage.total[$scope.day] = $scope.total;
            //     $localStorage.due[$scope.day] = $scope.due;
            //     $scope.empty = false;
            //     $scope.one = "block";
            //     $scope.two = "none";

            //     console.log($scope.cart);
            // }

            // $scope.removefromcart = function(id, len) {

            //     // if ($localStorage.discount != undefined) {
            //     //     swal
            //     // }

            //     var main = $scope.meals[$scope.day].options[len].option.name;
            //     var additive = $scope.meals[$scope.day].options[len].option.additives[id];
            //     var price = $scope.meals[$scope.day].options[len].option.prices[id];
            //     if (len == 0) {
            //         var newid = (len + 1) * (id + 1);
            //     } else {
            //         var prevsize = 0;
            //         for (var i = 0; i < len; i++) {
            //             prevsize += $scope.meals[$scope.day].options[i].option.additives.length;
            //         }
            //         var newid = prevsize + (id + 1);
            //     }
            //     var t = false;
            //     var currentposition = 0;
            //     var total = 0;
            //     for (var i = 0; i < $scope.cart.length; i++) {
            //         if (newid == $scope.cart[i].id) {
            //             t = true;
            //             currentposition = i;
            //         }
            //         total += Number.parseInt($scope.cart[i].price);
            //     }
            //     if (t == true) {
            //         var oldquantity = $scope.cart[currentposition].quantity;
            //         if (oldquantity > 1) {
            //             var newquantity = oldquantity - 1;
            //             var oldprice = $scope.cart[currentposition].price;
            //             var newprice = ((oldprice) / oldquantity) * newquantity;
            //             total = total - oldprice + newprice;
            //             $scope.cart[currentposition] = { 'id': newid, 'mainmeal': main, 'additive': additive, 'price': newprice, 'quantity': newquantity };
            //         } else {
            //             var oldprice = $scope.cart[currentposition].price;
            //             total = total - oldprice;
            //             $scope.cart.splice(currentposition, 1);
            //         }
            //     }

            //     $scope.total = total;
            //     $scope.due = $scope.total - $scope.companysubsidy;
            //     $scope.due = $scope.due - $scope.discount;
            //     $localStorage.cart[$scope.day] = $scope.cart;
            //     $localStorage.total[$scope.day] = $scope.total;
            //     $localStorage.due[$scope.day] = $scope.due;
            //     $scope.empty = false;
            //     $scope.one = "block";
            //     $scope.two = "none";

            // }

            $scope.loadPreloads = function() {
                // delete $localStorage.preDiscount;
                if ($localStorage.preDiscount != undefined) {
                    $scope.discount = $localStorage.preDiscount;
                    console.log($scope.discount);
                } else {
                    $scope.discount = 0;
                }

                if ($localStorage.preload != undefined) {
                    var preloads = $localStorage.preload;

                    preloads.forEach(function(load) {
                        var foodid = load[0];
                        var qty = load[1];

                        for (var i = 0; i < qty; i++) {
                            console.log(foodid);
                            $scope.addToCart(foodid, 0);
                        }

                    }, this);
                }
            }
        }


    }]);