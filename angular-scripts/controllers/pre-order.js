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
                $window.location.href = "#/pre-order/thursday";
            }
            toastr.options.timeOut = 1000;
            toastr.positionClass = "toast-bottom-left";

            $scope.preImage = 'createcombo';
            $scope.done = [];

            $scope.drinks = [];
            $scope.snacks = [];
            $scope.food = [];
            $scope.done = true;
            $scope.notdone = false;
            $scope.total = 0;

            $scope.delivery = 0;

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
                if (result.data.description == "Already Preordered") {
                    $scope.done = false;
                    $scope.notdone = true;
                } else {
                    $scope.meals = result.data.preorderList;
                    $scope.snacks = result.data.snacks;
                    $scope.drinks = result.data.drinks;
                    $scope.food = result.data.food;
                    $scope.done = true;
                    $scope.notdone = false;
                    console.log($scope.drinks);
                    $scope.loadPreloads();
                }
            }, function(error) {
                console.log(error);
            });

            if ($localStorage.preload != undefined) {
                // delete $localStorage.cart;
            } else {
                if ($localStorage.preClean == true) {
                    delete $localStorage.cart;
                    delete $localStorage.preClean;
                }
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
                    $scope.due = $scope.due - $scope.discount;
                    $scope.one = "block";
                    $scope.two = "none";
                }
            }

            $scope.checkRice = function() {
                var riceid = 1;
                var ricequantity = 0;
                for (var i = 0; i < $scope.cart.length; i++) {
                    if (riceid == $scope.cart[i].id) {
                        ricequantity = $scope.cart[i].quantity;
                    }
                }

                return ricequantity;
            }

            $scope.recalculateTotal = function(newPrice) {
                $scope.total += Number.parseInt(newPrice);
                $scope.due = $scope.total - $scope.companysubsidy;
                $scope.due = $scope.due - $scope.discount;

                // if (Number.parseInt($scope.due) >= 2499) {
                //     console.log("200");
                //     $scope.delivery = 200;
                // } else {
                //     console.log("50");
                //     $scope.delivery = 50;
                // }
                if ($scope.checkRice() >= 10) {
                    $scope.delivery = 200;
                } else {
                    $scope.delivery = 50;
                }
                $scope.due = $scope.due + $scope.delivery;
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

            $scope.checkDrinkSize = function(string, size) {
                if (size == 'big') {
                    return !!string.match("50");
                } else if (size == 'small') {
                    var twen = !!string.match("20");
                    var twen5 = !!string.match("25");

                    return (twen || twen5);
                }
            }

            $scope.freeDrinks = [];
            $scope.insertFreeDrink = function(drink) {
                $scope.freeDrinks.push(drink);

                if ($scope.freeDrinks.length > $scope.preDrinknum) {
                    $scope.freeDrinks.shift();
                }
            }

            $scope.isSelectedDrink = function(drink) {
                if ($scope.freeDrinks.indexOf(drink) !== -1) {
                    return true;
                } else {
                    return false;
                }
            }
            $scope.getSelectedNum = function(drink) {
                var num = 0;
                $scope.freeDrinks.forEach(function(item) {
                    if (item === drink) {
                        num++;
                    }
                }, this);

                return num;
            }

            $scope.loadPreloads = function() {
                if ($localStorage.preRefer) {
                    $scope.preRefer = $localStorage.preRefer;
                    $scope.preReferItem = $localStorage.preReferItem;

                    $scope.referList = [];
                    for (var i = 0; i < $scope.preRefer; i++) {
                        $scope.referList.push(i);
                    }
                }

                if ($localStorage.preDrinknum) {
                    $scope.preDrinknum = $localStorage.preDrinknum;
                    $scope.preDrinksize = $localStorage.preDrinksize;
                }

                if ($localStorage.preImage) {
                    $scope.preImage = $localStorage.preImage;
                }

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

                        console.log(foodid);

                        for (var i = 0; i < qty; i++) {
                            var fooditem = $scope.getFoodById(foodid);
                            $scope.addToCart(fooditem);
                        }

                    }, this);
                }

                delete $localStorage.preDiscount;
                // delete $localStorage.preImage;
                delete $localStorage.preload;
            }

            $scope.getFoodById = function(fid) {
                var food;
                $scope.food.forEach(function(item) {
                    if (fid == item.id) {
                        food = item;
                    }
                }, this);

                if (food == undefined) {
                    $scope.drinks.forEach(function(item) {
                        if (fid == item.id) {
                            food = item;
                        }
                    }, this);
                }
                return food;
            }

            var done = [];
            $scope.sendInvite = function(item) {
                $('#prow' + item).removeClass('animated shake');

                if ($localStorage.guest == true) {
                    var personname = $("#personname").val();
                    var refcode = $localStorage.refcode;
                } else {
                    var personname = $localStorage.data.data.username;
                    var refcode = $localStorage.data.data.refcode;
                }

                var sendBtn = $("#psendBtn" + item);

                var nameIn = $("#pinvite-name" + item);
                var emailIn = $("#pinvite-email" + item);
                var phoneIn = $("#pinvite-phone" + item);

                var name = nameIn.val();
                var email = emailIn.val();
                var phone = phoneIn.val();

                // if (checkRegex(email) {
                //     $('#row' + item).addClass('animated shake');
                //     return false;
                // }

                sendBtn.html("<i class='fa fa-spin fa-spinner'></i>");
                sendBtn.prop('disabled', true);
                nameIn.prop('disabled', true);
                emailIn.prop('disabled', true);
                phoneIn.prop('disabled', true);

                var invitedata = "personname=" + personname +
                    "&name=" + name + "&refcode=" + refcode + "&email=" + email;

                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "sendinvite",
                    data: invitedata,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        if (response.data.error == false) {
                            var user = {
                                name: name,
                                email: email,
                                phone: phone
                            };
                            done.push(user);
                            $scope.done = done;
                            $scope.remove(item);
                        } else {
                            sendBtn.html("Send");
                            sendBtn.prop('disabled', false);
                            nameIn.prop('disabled', false);
                            emailIn.prop('disabled', false);
                            phoneIn.prop('disabled', false);
                            $('#prow' + item).addClass('animated shake');
                        }
                    },

                    function(error) {
                        console.log(error);
                    });

            }

            $scope.remove = function(item) {
                var index = $scope.referList.indexOf(item);
                if (index > -1) {
                    $scope.referList.splice(index, 1);
                }
            }
        }


    }]);