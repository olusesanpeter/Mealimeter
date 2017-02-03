'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('preorderCtrl', ['$filter', '$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$route', function($filter, $scope, $http, $rootScope, $window, $localStorage, $location, $route) {

        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $window.location.href = "#/login";
        } else {
            console.log("check birth");
            if ($rootScope.birth == true) {
                console.log("birthing");
                $(document).ready(function() {
                    setTimeout(function() {
                        $("#loginmodal").modal('show');
                        console.log("birthed");
                        delete $rootScope.birth;
                        console.log("deleted " + $rootScope.birth);
                    }, 1000);
                });
            }

            if ($rootScope.openCart == true) {
                $(document).ready(function() {
                    setTimeout(function() {
                        $("#myCartModal").modal('show');
                        delete $rootScope.openCart;
                    }, 1000);
                });
            }

            if ($localStorage.guest == true) {
                var refcode = $localStorage.refcode;
                $scope.guest = true;
                $scope.refcode = refcode;
                $scope.office_payment_amount = 0;
                $scope.office_id = 0;
                $scope.token = 0;
            } else {
                $scope.guest = false;
                $localStorage.refcode = $localStorage.data.data.refcode;
                $scope.refcode = $localStorage.data.data.refcode;
                $scope.office_payment_amount = $localStorage.data.officedata.office_payment_amount;
                $scope.office_id = $localStorage.data.officedata.office_id;
                $scope.token = $localStorage.data.data.token;
                if ($localStorage.data.officedata.office_payment_type == 'company') {
                    $scope.companyfree = true;
                    $scope.companyname = $localStorage.data.officedata.office_name;
                }
            }
            // $localStorage.data.username = 'guest';
            // $localStorage.data.

            $scope.goto = function(place) {

                $("#myCartModal").modal('hide');
                $('#myCartModal').on('hidden.bs.modal', function(e) {
                    $window.location.href = "#/" + place;
                });
            }

            $scope.birthdayLoginFirst = function() {
                $rootScope.openCart = true;
                $scope.goto("login");
            }

            $scope.day = 3;
            $scope.daytext = "o";
            // if ($location.path().split('/')[2] == "monday") {
            //     $scope.day = 0;
            //     $scope.daytext = "Monday";
            // } else if ($location.path().split('/')[2] == "tuesday") {
            //     $scope.day = 1;
            //     $scope.daytext = "Tuesday";
            // } else if ($location.path().split('/')[2] == "wednesday") {
            //     $scope.day = 2;
            //     $scope.daytext = "Wednesday";
            // } else if ($location.path().split('/')[2] == "thursday") {
            //     $scope.day = 3;
            //     $scope.daytext = "Thursday";
            // } else if ($location.path().split('/')[2] == "friday") {
            //     $scope.day = 4;
            //     $scope.daytext = "Friday";
            // } else {
            //     $window.location.href = "#/pre-order/thursday";
            // }
            toastr.options.timeOut = 1500;
            toastr.positionClass = "toast-bottom-left";

            if ($localStorage.preImage) {
                console.log("local");
                $scope.preImage = $localStorage.preImage;
            } else {
                console.log("local combo");
                $scope.preImage = 'createcombo';
            }


            if ($localStorage.bigMsgBox == 'success') {
                swal({
                    title: "Great <small>Your order has been taken!</small>!",
                    text: "<h3>Please send a transfer of <b>N" + $localStorage.msgDueTotal + "</b></h3> to <br /> Account Name: <b>Novedad limited</b><br />Account Number: <b>0140019459</b><br />Bank: <b>Guaranty Trust Bank</b><br /><br />With the refrence number <b>" + $localStorage.msgDesc + "</b> in the description. to complete your order<br /><small>An email has also been sent to you</small>",
                    html: true
                });

                delete $localStorage.bigMsgBox;
                delete $localStorage.msgDueTotal;
                delete $localStorage.msgDesc;
                delete $localStorage.msgBox;
                delete $localStorage.showMsg;

            } else if ($localStorage.smallMsgBox == 'success') {

                var url = $localStorage.msgUrl;
                // var extraText = "<br /><a href='mailto:colleagues@example.com?&body="+url+"'>Share with your colleagues</a>";
                var extraText = "";
                swal({
                    title: "Your birthday menu has been created!",
                    text: $localStorage.msg + extraText,
                    html: true
                });

                delete $localStorage.smallMsgBox;
                delete $localStorage.msg;
                delete $localStorage.msgUrl;
                delete $localStorage.bigMsgBox;
                delete $localStorage.msgDueTotal;
                delete $localStorage.msgDesc;
                delete $localStorage.msgBox;
                delete $localStorage.showMsg;
            } else if ($localStorage.msgBox == 'success') {
                swal("Great!", $localStorage.showMsg, "success");

                delete $localStorage.msgBox;
                delete $localStorage.showMsg;
            }

            $scope.discount = 0;
            $scope.coupon = "";

            $scope.deliveryDate = new Date();
            $scope.deliveryDate.setDate($scope.deliveryDate.getDate() + 1);

            $scope.tomorrowDate = new Date();
            $scope.tomorrowDate.setDate($scope.tomorrowDate.getDate() + 1);

            $scope.done = [];

            $scope.drinks = [];
            $scope.snacks = [];
            $scope.food = [];
            $scope.done = true;
            $scope.notdone = false;
            $scope.total = 0;

            $scope.delivery = 100;
            $scope.packaging = 0;

            $scope.newFoods = [];
            $scope.currentTab = "breakfast";

            $scope.newCart = [];
            $scope.newTotalPrice = 0;
            $scope.newCartNum = 0;

            if ($localStorage.newCart != undefined) {
                $scope.newCart = $localStorage.newCart;
                $scope.newTotalPrice = $localStorage.newTotalPrice;
                $scope.newCartNum = $localStorage.newCartNum;
                setTimeout(function() {
                    $scope.prepareCheckout();
                }, 2000);
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

            $scope.couponValid = false;
            $scope.checkCoupon = function(cc) {
                $scope.coupon = cc;
                var link = $rootScope.mealimeter;
                $http({
                    method: "GET",
                    url: link + "buy/validateCoupon/" + cc,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(res) {
                    var result = res.data;
                    console.log(result);
                    if (result['status'] == false) {
                        toastr.warning(result['reason'], "Invalid Coupon");
                        // this.showToast(result['reason']);
                    } else {
                        let coup = result['coupon'];
                        $scope.couponObj = coup;
                        $scope.couponValid = true;
                        if (coup['type'] == 'amount') {
                            $scope.couponDesc = "get N" + coup['value'] + " off";
                        } else if (coup['type'] == 'percent') {
                            $scope.couponDesc = "get " + coup['value'] + "% off";
                        }
                        toastr.success($scope.couponDesc, "Valid Coupon");
                    }
                }, function(error) {
                    console.log(error);
                });

            }

            $scope.applyCoupon = function() {
                $scope.couponApplied = true;
                if ($scope.couponObj.type == 'amount') {
                    $scope.discount = Number.parseInt($scope.couponObj.value);
                } else if (this.couponObj.type == 'percent') {
                    let percentage = Number.parseInt($scope.couponObj.value) / 100;
                    $scope.discount = Math.floor($scope.due * percentage);
                }
                $scope.due = $scope.due - $scope.discount;

                if ($scope.due < 0) {
                    $scope.due = 0;
                }
            }

            $scope.newDeleteFromCart = function(item) {
                var exist = false;
                var already_id = null;
                var quant = 1;

                //Check if the item already existed
                for (var i = 0; i < $scope.newCart.length; i++) {
                    if (item.id === $scope.newCart[i].id) {
                        exist = true;
                        already_id = i;
                        quant = $scope.newCart[i].quantity;
                    }
                }

                //if it exist
                if (exist) {
                    //remove the whole thing
                    $scope.newCart.splice(already_id, 1);
                    // toastr.error(item.name + " has been removed from cart", "removed from cart");
                }

                $scope.newRecalculateTotal(-Number.parseInt(item.price) * quant);
            }

            $scope.newRemoveFromCart = function(item) {
                var exist = false;
                var already_id = null;

                //Check if the item already existed
                for (var i = 0; i < $scope.newCart.length; i++) {
                    if (item.id === $scope.newCart[i].id) {
                        exist = true;
                        already_id = i;
                    }
                }

                //if it exist
                if (exist) {
                    var olditem = $scope.newCart[already_id];
                    //if the quantity is more than one remove only one quantity and reduce price
                    if (olditem.quantity > 1) {
                        var newquantity = olditem.quantity - 1;
                        olditem.price = (olditem.price / olditem.quantity) * newquantity;
                        olditem.quantity = newquantity;
                        $scope.newCart[already_id] = olditem;
                        // toastr.warning("One quantity of " + item.name + " has been removed to cart. " + newquantity + "x remaining", "Removed from cart");
                    }
                    //else remove the whole thing
                    else {
                        $scope.newCart.splice(already_id, 1);
                        // toastr.error(item.name + " has been removed from cart", "removed from cart");
                    }
                } else {
                    // toastr.info("it wasn't in the cart");
                }
                $scope.newRecalculateTotal(-Number.parseInt(item.price));
            }

            $scope.newAddToCart = function(item, quant) {
                if (!quant) {
                    quant = 1;
                }
                var option = {
                    id: item.id,
                    mainmeal: item.main,
                    name: item.name,
                    price: Number.parseInt(item.price) * Number.parseInt(quant),
                    quantity: Number.parseInt(quant),
                    food: item
                }

                var first_time = true;
                var already_id = null;

                console.log($scope.newCart);

                //Check if the item already existed
                for (var i = 0; i < $scope.newCart.length; i++) {
                    if (option.id === $scope.newCart[i].id) {
                        first_time = false;
                        already_id = i;
                    }
                }
                var quantity = 0;
                //if it doesnt exist add to cart for the first time
                if (first_time) {
                    quantity = quant;
                    $scope.newCart.push(option);
                }
                //else just increase the quantity and price of the old one 
                else {
                    var olditem = $scope.newCart[already_id];
                    var newquantity = olditem.quantity + quant;
                    olditem.price = (olditem.price / olditem.quantity) * newquantity;
                    olditem.quantity = newquantity;
                    quantity = newquantity;
                    $scope.newCart[already_id] = olditem;
                }
                console.log($scope.newCart);
                $scope.newRecalculateTotal(item.price);
            }


            $scope.newRecalculateTotal = function(newprice) {
                $scope.newTotalPrice += Number.parseInt(newprice);
                $scope.newCartNum = $scope.newCart.length;

                console.log($scope.newTotalPrice);
                $localStorage.newCart = $scope.newCart;
                $localStorage.newCartNum = $scope.newCartNum;
                $rootScope.newCartNum = $scope.newCartNum;
                $localStorage.newTotalPrice = $scope.newTotalPrice;

                console.log($rootScope.newCartNum);
                $scope.prepareCheckout();
                // this.storeInStorage();
            }

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
                    console.log($scope.food);
                    $scope.loadPreloads();
                }
            }, function(error) {
                console.log(error);
            });

            if ($localStorage.guest != undefined) {
                var urllink = link + "getfoodlist";
            } else {
                var urllink = link + "getfoodlist?office_id=" + $localStorage.data.officedata.office_id;
            }

            $http({
                method: "POST",
                url: urllink,
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(result) {
                var rdata = result.data;
                console.log("new food");
                console.log(result);
                if (result.data.description == "Already Preordered") {
                    $scope.done = false;
                    $scope.notdone = true;
                } else {
                    $scope.newBreakfast = [];
                    $scope.newLunch = [];
                    $scope.newTakehome = [];
                    $scope.newDrinks = [];

                    rdata.food.forEach(function(fooditem) {
                        $scope.newFoods.push(fooditem);
                    }, this);
                    rdata.drinks.forEach(function(fooditem) {
                        $scope.newFoods.push(fooditem);
                    }, this);
                    console.log($scope.newFoods);
                    $scope.loadingmeal = false;

                    // $scope.meals = result.data.preorderList;
                    // $scope.snacks = result.data.snacks;
                    // $scope.drinks = result.data.drinks;
                    // $scope.food = result.data.food;
                    // $scope.done = true;
                    // $scope.notdone = false;
                    // console.log($scope.food);
                    // $scope.loadPreloads();
                }
            }, function(error) {
                console.log(error);
            });

            $scope.filterList = function(itemMain, category) {
                var checker = $scope.currentTab;
                if (category) {
                    checker = category;
                }

                if (checker == 'drinks') {
                    if (itemMain.toLowerCase().indexOf('drinks') >= 0) {
                        return true;
                    }
                    if (itemMain.toLowerCase().indexOf('water') >= 0) {
                        return true;
                    }
                    if (itemMain.toLowerCase().indexOf('juice') >= 0) {
                        return true;
                    }
                    if (itemMain.toLowerCase().indexOf('smoothie') >= 0) {
                        return true;
                    }
                }

                if (itemMain.toLowerCase().indexOf(checker) >= 0) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.getStarColor = function(rating, itemnum) {
                if (itemnum <= rating) {
                    return 'green';
                }
                return 'silver';
            }

            $scope.selectTab = function(name) {
                $scope.currentTab = name;
            }


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
                var real = 0;
                for (var i = 0; i < $scope.cart.length; i++) {
                    if (13 == $scope.cart[i].id) {
                        real = $scope.cart[i].quantity * 3;
                        ricequantity = ricequantity + real;
                    }
                    if (12 == $scope.cart[i].id ||
                        11 == $scope.cart[i].id ||
                        25 == $scope.cart[i].id ||
                        26 == $scope.cart[i].id ||
                        27 == $scope.cart[i].id ||
                        28 == $scope.cart[i].id ||
                        29 == $scope.cart[i].id) {
                        real = $scope.cart[i].quantity;
                        ricequantity = ricequantity + real;
                    }
                    // if (11 == $scope.cart[i].id) {
                    //     real = $scope.cart[i].quantity;
                    //     ricequantity = ricequantity + real;
                    // }
                    // if (26 == $scope.cart[i].id) {
                    //     real = $scope.cart[i].quantity;
                    //     ricequantity = ricequantity + real;
                    // }
                    // if (25 == $scope.cart[i].id) {
                    //     real = $scope.cart[i].quantity;
                    //     ricequantity = ricequantity + real;
                    // }
                }

                return ricequantity;
            }

            $scope.cFreeDrinks = [];
            $scope.openComboDrinks = function(drinksNum, drinkssize, drinkid) {
                $scope.cPreDrinknum = drinksNum;
                $scope.cPreDrinksize = drinkssize;

                $scope.cDrinkId = drinkid;
                if ($scope.cFreeDrinks[drinkid] == undefined) {
                    $scope.cFreeDrinks[drinkid] = [];
                }
                $("#combosmoothiemodal").modal();
            }
            $scope.cInsertFreeDrink = function(drink) {
                var dd = {
                    id: drink.id,
                    name: drink.name
                }
                $scope.cFreeDrinks[$scope.cDrinkId].push(dd);

                if ($scope.cFreeDrinks[$scope.cDrinkId].length > $scope.cPreDrinknum) {
                    $scope.cFreeDrinks[$scope.cDrinkId].shift();
                }
                console.log($scope.cFreeDrinks[$scope.cDrinkId]);
                $localStorage.cFreeDrinks = $scope.cFreeDrinks;
            }

            $scope.cIsSelectedDrink = function(drink) {
                var r = false;
                $scope.cFreeDrinks[$scope.cDrinkId].forEach(function(item) {
                    if (r == false) {
                        if (item.id == drink.id) {
                            r = true;
                        }
                    }
                }, this);
                return r;
            }
            $scope.cGetSelectedNum = function(drink) {
                var num = 0;
                $scope.cFreeDrinks[$scope.cDrinkId].forEach(function(item) {
                    if (item.id == drink.id) {
                        num++;
                    }
                }, this);

                return num;
            }

            $scope.recalculateTotal = function(newPrice) {
                $scope.total += Number.parseInt(newPrice);
                $scope.due = $scope.total - $scope.companysubsidy;
                $scope.due = $scope.due - $scope.discount;

                // if ($scope.checkRice() >= 10) {
                //     $scope.delivery = 200;
                // } else {
                //     $scope.delivery = $scope.checkRice() * 50;
                // }
                // $scope.packaging = $scope.checkRice() * 50;

                $scope.due = $scope.due + $scope.delivery;
                // $scope.due = $scope.due + $scope.packaging;
                if ($scope.due < 0) {
                    $scope.due = 0;
                }
                $localStorage.cart[$scope.day] = $scope.cart;
                $localStorage.total[$scope.day] = $scope.total;
                $localStorage.due[$scope.day] = $scope.due;

                $scope.empty = false;
                $scope.one = "block";
                $scope.two = "none";
            }

            $scope.addToCart = function(fooditem) {
                $scope.newAddToCart(fooditem);

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
                $scope.newRemoveFromCart(fooditem);

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

            $scope.deleteFromCart = function(fooditem) {
                $scope.newDeleteFromCart(fooditem);

                var exist = false;
                var already_id = null;
                var quant = 1;

                //Check if the item already existed
                for (var i = 0; i < $scope.cart.length; i++) {
                    if (fooditem.id === $scope.cart[i].id) {
                        exist = true;
                        already_id = i;
                        quant = $scope.cart[i].quantity;
                    }
                }

                //if it exist
                if (exist) {

                    $scope.cart.splice(already_id, 1);
                    toastr.error(fooditem.name + " has been removed from cart", "removed from cart");
                    $scope.recalculateTotal(-fooditem.price * quant);
                } else {
                    toastr.info("it wasn't in the cart");
                }
            }

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
                var dd = {
                    id: drink.id,
                    name: drink.name
                }
                $scope.freeDrinks.push(dd);
                if ($scope.freeDrinks.length > $scope.preDrinknum) {
                    $scope.freeDrinks.shift();
                }

                $localStorage.freeDrinks = $scope.freeDrinks;
            }

            $scope.isSelectedDrink = function(drink) {
                var r = false;
                $scope.freeDrinks.forEach(function(item) {
                    if (r == false) {
                        if (item.id == drink.id) {
                            r = true;
                        }
                    }
                }, this);
                return r;
            }
            $scope.getSelectedNum = function(drink) {
                var num = 0;
                $scope.freeDrinks.forEach(function(item) {
                    if (item.id === drink.id) {
                        num++;
                    }
                }, this);

                return num;
            }
            if ($localStorage.comboid != undefined) {
                $scope.comboId = $localStorage.comboid;
                console.log($scope.comboId);
            } else {
                $scope.comboId = 0;
            }
            $scope.gotoTeam10 = function() {
                var turkey = $("#teamturkey10").val();
                var chicken = $("#teamchicken10").val();
                var beef = $("#teambeef10").val();
                var plan = $("#teamplan10").val();


                $scope.gotoCombo('teamof10', 1, 10);

                $localStorage.preload = [];

                var addturkey = [4, turkey];
                $localStorage.preload.push(addturkey);
                var addchicken = [5, chicken];
                $localStorage.preload.push(addchicken);
                var addbeef = [3, beef];
                $localStorage.preload.push(addbeef);
                var addplan = [2, plan];
                $localStorage.preload.push(addplan);

                console.log($localStorage.preload);

                $scope.loadNewPreloads();
                $scope.loadPreloads();
            }
            $scope.gotoTeam20 = function() {
                var turkey = $("#teamturkey20").val();
                var chicken = $("#teamchicken20").val();
                var beef = $("#teambeef20").val();
                var plan = $("#teamplan20").val();


                $scope.gotoCombo('teamof20', 1, 20);

                $localStorage.preload = [];

                var addturkey = [4, turkey];
                $localStorage.preload.push(addturkey);
                var addchicken = [5, chicken];
                $localStorage.preload.push(addchicken);
                var addbeef = [3, beef];
                $localStorage.preload.push(addbeef);
                var addplan = [2, plan];
                $localStorage.preload.push(addplan);

                console.log($localStorage.preload);

                $scope.loadNewPreloads();
                $scope.loadPreloads();
            }
            $scope.gotoCombo = function(image, comboid, foodnum, refer, referitem, drinknum, drinksize) {
                $("#sdmodal").modal('hide');
                $("#teammodal").modal('hide');

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

                $scope.loadNewPreloads();
                $scope.loadPreloads();
            }
            $scope.loadNewPreloads = function() {
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

                delete $localStorage.preload;

                $scope.comboId = 0;
            }
            $scope.loadPreloads = function() {


                if ($localStorage.preImage) {
                    $scope.preImage = $localStorage.preImage;
                }

                if ($localStorage.preDiscount != undefined) {
                    $scope.discount = $localStorage.preDiscount;
                    console.log($scope.discount);
                } else {
                    $scope.discount = 0;
                }

                delete $localStorage.preDiscount;
                // delete $localStorage.preImage;
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

            $scope.newFoodidstring = "";
            $scope.newQuantitystring = "";
            $scope.newPayable = 0;

            $scope.cartPrepareCheckout = function() {
                $scope.newFoodidstring = "";
                $scope.newQuantitystring = "";
                $scope.newPayable = 0;

                var foodid = [];
                var quantity = [];
                var newCart = [];
                if ($localStorage.newCart) {
                    newCart = $localStorage.newCart;
                }

                newCart.forEach(crt => {
                    console.log(crt);
                    foodid.push(crt.id);
                    quantity.push(crt.quantity);
                });

                $scope.newFoodidstring = foodid.join(";");
                $scope.newQuantitystring = quantity.join(";");
            }

            $scope.prepareCheckout = function() {
                $scope.cartPrepareCheckout();

                $scope.newPayable = Number.parseInt($scope.newTotalPrice) - Number.parseInt($scope.office_payment_amount);
                if ($scope.discount > 0) {
                    $scope.newPayable = Number.parseInt($scope.newPayable) - Number.parseInt($scope.discount);
                }
                if ($scope.newPayable < 0) {
                    $scope.newPayable = 0;
                } else {
                    $scope.newPayable = $scope.newPayable + $scope.delivery;
                }
                $scope.checkoutdata = {
                    token: $scope.token,
                    office_id: $scope.office_id,
                    food_id: $scope.newFoodidstring,
                    quantity: $scope.newQuantitystring,
                    total_price: $scope.newTotalPrice,
                    paid: $scope.newPayable,
                    company_paid: $scope.office_payment_amount,
                    refcode: $scope.refcode,
                    deliverydate: moment($scope.deliveryDate).format("YYYY-MM-DD")
                }

                console.log($scope.checkoutdata);
            }


            $scope.formData = function(myFormData) {
                return Object.keys(myFormData).map(function(key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
                }).join('&');
            }


            $scope.emptyCarts = function() {
                delete $localStorage.due;
                delete $localStorage.total;
                delete $localStorage.cart;
                delete $localStorage.cFreeDrinks;

                $rootScope.newCart = [];
                $scope.cart = [];
                $localStorage.newCart = [];
                $localStorage.newCartNum = 0;
                $rootScope.newCartNum = 0;
                $localStorage.newTotalPrice = 0;
                $rootScope.newTotalPrice = 0;
                $localStorage.new = 0;
            }

            $scope.placeOrder = function(method, tag) {
                this.loading = true;
                $scope.prepareCheckout();

                tag = tag || false;

                // this.prepareCheckout();

                if (method) {
                    $scope.checkoutdata.payment_method = method;
                }
                if (tag) {
                    $scope.checkoutdata.event_tag = tag;
                }

                var checkoutdata = $scope.formData($scope.checkoutdata);
                var payablee = $scope.checkoutdata.paid;
                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "makeorder",
                    data: checkoutdata,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        if (response['error'] == true) {
                            console.log(response['description']);
                        } else {
                            console.log(response);
                            $scope.emptyCarts();
                            console.log("Placed orders");
                            $localStorage.showMsg = "Successfully placed your orders";
                            $localStorage.msgBox = "success";

                            $("#myCartModal").modal('hide');
                            $('#myCartModal').on('hidden.bs.modal', function(e) {
                                if (!tag) {
                                    $localStorage.showInviteContact = true;
                                    $localStorage.inviteTotal = payablee;
                                }
                                $scope.cancelFoodEvent();
                                $route.reload();
                            });

                        }
                    },
                    function(error) {
                        console.log(error);
                    });
            }

            $scope.payWithWallet = function() {
                if ($rootScope.balance < $scope.newPayable) {
                    toastr.warning("You dont have enough in your wallet. Balance: " + $rootScope.balance);
                } else {
                    $scope.placeOrder("Wallet");
                }
            }

            $scope.payWithOnlineTransfer = function() {
                var randString = '';
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var i = 6; i > 0; --i) randString += chars[Math.floor(Math.random() * chars.length)];
                var code = randString.toUpperCase();
                var compstring = "Paid by online transfer: " + code;

                $rootScope.$emit('payOnlineTransfer', { code: code });

                $localStorage.bigMsgBox = "success";
                $localStorage.msgDueTotal = $scope.newPayable;
                console.log("payable: " + $scope.newPayable);
                $localStorage.msgDesc = randString.toUpperCase();

                $scope.placeOrder(compstring);
            }


            $scope.eventOrderLoading = false;
            $scope.orderForEvent = function() {
                $scope.eventOrderLoading = true;
                var randString = '';
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var i = 6; i > 0; --i) randString += chars[Math.floor(Math.random() * chars.length)];
                var tag = randString.toUpperCase();

                var url = "http://mealimeter.com/m/#/event?tag=" + tag;

                $localStorage.smallMsgBox = "success";
                $localStorage.msgUrl = url;

                $localStorage.msg = "A link would be sent to your email to invite your colleagues to select meals from your birthday menu";
                // $localStorage.msg = "Successfull!!! Please share this url with your colleagues <br /><br /><b><a href='" + url + "'>" + url + "</a></b><br /><br /> to invite them";
                console.log("payable: " + tag);

                $scope.placeOrder("Event", tag);
                // $scope.cancelFoodEvent();
            }

            $scope.cancelFoodEvent = function() {
                console.log("canceling food order");
                delete $localStorage.foodEvent;
                $rootScope.foodEvent = undefined;
                $scope.emptyCarts();
            }
            $rootScope.cancelFoodEvent = function() {
                console.log("canceling food order");
                delete $localStorage.foodEvent;
                $rootScope.foodEvent = undefined;
                $scope.emptyCarts();
            }

            $scope.payWithCard = function() {
                var pb = document.getElementById("payBtn");
                pb.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Loading...";

                var payable = $scope.newPayable;
                if ($scope.discount > 0) {
                    payable = $scope.newPayable - $scope.discount;
                }
                if (payable < 0) {
                    payable = 1;
                }

                var handler = PaystackPop.setup({
                    key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
                    // key: 'pk_test_bac3b11eb4e39fe3acadd07a0a111d32067aa751',

                    email: $localStorage.data.data.email,
                    amount: payable * 100,
                    ref: "MM_" + Math.floor(Math.random() * 100000) + "_" + Math.floor(Math.random() * 100000),
                    metadata: {
                        custom_fields: [{
                            username: $localStorage.data.data.username
                        }]
                    },
                    callback: function(response) {
                        console.log(response);
                        $scope.placeOrder("Card");
                        pb.innerHTML = '<i class="fa fa-credit-card"></i> Pay with card';
                    },
                    onClose: function() {
                        pb.innerHTML = '<i class="fa fa-credit-card"></i> Pay with card';
                        $scope.$broadcast('changetitle-back');
                        // alert('No transaction was carried out');
                        swal("Cancelled", "No transaction was carried out", "error");
                    }
                });
                handler.openIframe();
            }

            $scope.checkPayable = function() {
                if ($scope.newPayable > 0) {
                    return true;
                } else {
                    return false;
                }
            }

            ////////INVITE CONTACT/////////////////////

            $scope.clickRow = function(ev, idx) {
                if (ev.target.type !== 'checkbox') {
                    $('#checkblock' + idx).trigger('click');
                }
            }

            $scope.testIV = function() {
                console.log("testing succeess");
                $localStorage.showInviteContact = true;
                $route.reload();
            }

            $scope.contacts = [];
            $scope.ccs = [];
            $scope.feedback = [];
            $scope.maxNum = 9;
            $scope.countIV = 0;
            $scope.wLoading = true;
            $scope.showClose = false;

            if ($localStorage.inviteNum == undefined) {
                $localStorage.inviteNum = 0;
            }

            if ($localStorage.showInviteContact == true) {
                console.log("herrrrrrrrrrrrr");
                setTimeout(function() {
                    $("#inviteContactModal").modal();
                    $localStorage.showInviteContact = false;
                }, 1000);
            }

            if ($localStorage.data != undefined) {
                var link = $rootScope.mealimeter;
                $http({
                    method: "GET",
                    url: link + "order/getColleagues?token=" + $localStorage.data.data.token,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        var result = response.data;
                        $scope.wLoading = false;
                        console.log("contats--");
                        console.log(result);
                        if (result['error'] == false) {
                            $scope.contacts = result['result'];
                        }
                    },
                    function(error) {
                        console.log(error);
                    });
            }


            $scope.checkUser = function(user_id, ev) {
                user_id = Number.parseInt(user_id);
                console.log(ev);

                var maxNum = $scope.maxNum - $localStorage.inviteNum;
                if (ev.target.checked) {
                    console.log("checked");
                    if ($scope.ccs.length >= maxNum) {
                        ev.target.checked = false;
                        // this.showToast("Maximum of " + this.maxNum + " colleagues allowed");
                        toastr.warning("Maximum of " + $scope.maxNum + " colleagues allowed")
                        console.log(ev);
                        return false;
                    } else {
                        $scope.ccs.push(user_id);
                    }
                } else {
                    if ($scope.checkContains(user_id)) {
                        var index = $scope.ccs.indexOf(user_id);
                        if (index > -1) {
                            $scope.ccs.splice(index, 1);
                        }
                    }
                }

                console.log($scope.ccs);
            }

            $scope.checkContains = function(user_id) {
                return $scope.ccs.indexOf(user_id) > -1;
            }

            $scope.getInviteStatus = function(invite_id) {
                if ($scope.feedback[invite_id]) {
                    return $scope.feedback[invite_id];
                }
                return false;
            }

            $scope.sendInvites = function() {
                $scope.ccs.forEach(invite => {
                    console.log("Sending for - " + invite);
                    $scope.feedback[invite] = 'sending';
                    console.log($scope.feedback);
                    $scope.sendInvite(invite);
                    console.log("Send invite for - " + invite);
                });
            }

            $scope.sendInvite = function(invite_id) {
                var senddata = "token=" + $localStorage.data.data.token + "&office_id=" + $localStorage.data.officedata.office_id + "&invite_id=" + invite_id + "&total=" + $scope.payable;

                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    data: senddata,
                    url: link + "order/sendInvite",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                        var result = response.data;
                        console.log(result);
                        if (result['error'] == false) {
                            if (result['result'] == true) {
                                $scope.feedback[invite_id] = 'sent';
                                $localStorage.inviteNum = $localStorage.inviteNum + 1;
                            } else {
                                $scope.feedback[invite_id] = 'already';
                            }

                            $scope.showClose = true;

                            //remove from next send
                            var index = $scope.ccs.indexOf(invite_id);
                            if (index > -1) {
                                $scope.ccs.splice(index, 1);
                            }
                        } else {
                            $scope.feedback[invite_id] = 'wrong';
                        }
                        console.log("Sent to " + invite_id);
                        console.log($scope.feedback);
                    },
                    function(error) {
                        console.log(error);
                    });
            }

            $scope.searchFood = function(searchQuery) {
                console.log(searchQuery);
                $scope.loadingmeal = false;
                $scope.filteredFoods = $filter('filter')($scope.newFoods, searchQuery);
                // console.log($scope.filteredFoods);
            }

            $scope.filteredFoods = $scope.newFoods;

            $scope.getAmount = function(type) {
                var num = 0;
                $scope.filteredFoods.forEach(function(food) {
                    if ($scope.filterList(food.main, type)) {
                        num++;
                    }
                }, this);

                return num;
            }

        }


    }]);