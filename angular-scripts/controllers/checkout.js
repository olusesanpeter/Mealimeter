'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller("paymentCtrl", ['$rootScope', '$scope', '$sce', '$localStorage', '$window', '$http', '$route', function($rootScope, $scope, $sce, $localStorage, $window, $http, $route) {

        var pb = document.getElementById("payBtn");
        pb.innerHTML = '<i class="fa fa-credit-card"></i> Pay with card';

        $scope.companyfree = false;

        if ($localStorage.guest == true) {
            var refcode = $localStorage.refcode;
        } else {
            $localStorage.refcode = $localStorage.data.data.refcode;
            if ($localStorage.data.officedata.office_payment_type == 'company') {
                $scope.companyfree = true;
                $scope.companyname = $localStorage.data.officedata.office_name;
            }
        }

        console.log("paymentctrl");


        $scope.payComp = false;

        var food = "";
        var foodid = "";
        var price = "";
        var quantity = "";
        var comment = "";
        var total = 0;
        var due = 0;
        var companysubsidy = 0;
        for (var i = 0; i < 5; i++) {
            if ($localStorage.cart[i] == undefined) {
                food += ";";
                foodid += ";";
                price += ";";
                quantity += ";";
                comment += ";";
            } else {
                angular.forEach($localStorage.cart[i], function(foods) {
                    food += foods.mainmeal + " + " + foods.additive + ",.,";
                    foodid += foods.id + ",.,";
                    price += foods.price + ",.,";
                    quantity += foods.quantity + ",.,";
                });
                food += ";";
                foodid += ";";
                price += ";";
                quantity += ";";
                comment += $localStorage.cart[i].comment + ";";
                // console.log($localStorage.due[i]);
                total += Number.parseInt($localStorage.total[i]);
                due += Number.parseInt($localStorage.due[i]);
                companysubsidy += Number.parseInt($scope.companysubsidy);
            }
        }
        $scope.total = total;
        $scope.due = due;

        // console.log(due);
        // console.log(total);
        // console.log($scope.total);

        var drinksstring = "";
        // if ($localStorage.freeDrinks != undefined) {
        //     var s = $localStorage.freeDrinks;
        //     drinksstring = " Refer Selection: " + drinksstring + JSON.stringify(s);
        //     console.log(drinksstring);
        // }
        if ($localStorage.cFreeDrinks != undefined) {
            var s = $localStorage.cFreeDrinks;
            drinksstring += drinksstring + JSON.stringify(s);
            console.log(drinksstring);
        }

        $scope.ngFn = function() {
            var food = "";
            var foodid = "";
            var price = "";
            var quantity = "";
            var comment = "";
            var total = 0;
            var due = 0;
            var companysubsidy = 0;
            for (var i = 0; i < 5; i++) {
                if ($localStorage.cart[i] == undefined) {
                    food += ";";
                    foodid += ";";
                    price += ";";
                    quantity += ";";
                    comment += ";";
                } else {
                    angular.forEach($localStorage.cart[i], function(foods) {
                        food += foods.mainmeal + " + " + foods.additive + ",.,";
                        foodid += foods.id + ",.,";
                        price += foods.price + ",.,";
                        quantity += foods.quantity + ",.,";
                    });
                    food += ";";
                    foodid += ";";
                    price += ";";
                    quantity += ";";
                    comment += $localStorage.cart[i].comment + ";";
                    // console.log($localStorage.due[i]);
                    total += Number.parseInt($localStorage.total[i]);
                    due += Number.parseInt($localStorage.due[i]);
                    companysubsidy += Number.parseInt($scope.companysubsidy);
                }
            }

            pb.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Loading...";

            var handler = PaystackPop.setup({
                key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
                // key: 'pk_test_bac3b11eb4e39fe3acadd07a0a111d32067aa751',

                email: $localStorage.data.data.email,
                amount: due * 100,
                ref: "MM_" + Math.floor(Math.random() * 100000) + "_" + Math.floor(Math.random() * 100000),
                metadata: {
                    custom_fields: [{
                        username: $localStorage.data.data.username
                    }]
                },
                callback: function(response) {
                    console.log(response);
                    pb.innerHTML = '<i class="fa fa-credit-card"></i> Pay with card';
                    // alert('success. transaction ref is ' + response.reference);
                    var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&foodid=" + foodid + "&price=" + price + "&quantity=" + quantity + "&comment=" + comment;
                    console.log(data);
                    var link = $rootScope.mealimeter;
                    $http({
                        method: "POST",
                        url: link + "buycash",
                        data: data,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).then(function(result) {
                        delete $localStorage.due;
                        delete $localStorage.total;
                        delete $localStorage.cart;
                        delete $localStorage.cFreeDrinks;
                        // alert("Your order has been taken");
                        swal("Great!", "Your order has been taken!", "success");
                        $('.modal').modal('hide');
                        $('#modal-id').modal('hide');
                        $route.reload();
                    }, function(error) {
                        console.log(error);
                    });
                },
                onClose: function() {
                    pb.innerHTML = '<i class="fa fa-credit-card"></i> Pay with card';
                    $scope.$broadcast('changetitle-back');
                    // alert('No transaction was carried out');
                    swal("Cancelled", "No transaction was carried out", "error");
                }
            });
            handler.openIframe();
        };


        $scope.togglePayComp = function() {
            $scope.payComp = !$scope.payComp;
        }
    }])
    .controller('CheckoutCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$route', function($scope, $http, $rootScope, $window, $localStorage, $location, $route) {

        if ($localStorage.guest == true) {
            var refcode = $localStorage.refcode;
        } else {
            $localStorage.refcode = $localStorage.data.data.refcode;
            if ($localStorage.data.officedata.office_payment_type == 'company') {
                $scope.companyfree = true;
                $scope.companyname = $localStorage.data.officedata.office_name;
            }
        }

        var drinksstring = "";
        // }
        if ($localStorage.cFreeDrinks != undefined) {
            var s = $localStorage.cFreeDrinks;
            drinksstring = drinksstring + JSON.stringify(s);
            console.log(drinksstring);
        }

        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $window.location.href = "#/login";
        } else {
            if ($localStorage.guest == true) {
                console.log("guest");
                $scope.username = 'guest';
            } else {
                console.log("logged user");
                $scope.username = $localStorage.data.data.username;
            }
            if ($localStorage.flashmessage != undefined) {
                swal("Successfully Registered", $localStorage.flashmessage, "success");
                delete $localStorage.flashmessage;
            }

            $scope.redirect = function(day) {
                if (day == "thursday") {
                    $window.location.href = "#/home";
                } else {
                    $window.location.href = "#/home2";
                }
                // $window.location.href = "#/pre-order/" + day;
            };
            if ($localStorage.guest == true) {
                $scope.companysubsidy = 0;
            } else {
                $scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
            }
            $scope.weeks = [];
            $scope.weeks[0] = [];
            $scope.weeks[1] = [];

            if ($localStorage.cart[1] != undefined || $localStorage.cart[1] != null) {
                $scope.tuesday = $localStorage.cart[1];
                $scope.tuesdaytotal = $localStorage.total[1];
                $scope.tuesdaydue = $localStorage.due[1];

                if ($localStorage.cart[1].comment != undefined) {
                    $scope.tuesdayComment = $localStorage.cart[1].comment;
                } else {
                    $scope.tuesdayComment = "";
                }
            } else {
                $scope.tuesday = [];
                $scope.tuesdaytotal = 0;
                $scope.tuesdaydue = 0;
                $scope.tuesdayComment = "";
            }

            $scope.weeks[1].name = 'Tuesday';
            $scope.weeks[1].cart = $scope.tuesday;
            $scope.weeks[1].total = $scope.tuesdaytotal;
            $scope.weeks[1].due = $scope.tuesdaydue;
            $scope.weeks[1].comment = $scope.tuesdayComment;

            // $scope.$watch('weeks[1].comment', function(newval, oldval) {
            //     $localStorage.cart[1].comment = newval;
            //     console.log(newval);
            //     console.log(oldval);
            // }, true);

            if ($localStorage.cart[3] != undefined || $localStorage.cart[3] != null) {
                $scope.thursday = $localStorage.cart[3];
                $scope.thursdaytotal = $localStorage.total[3];
                $scope.thursdaydue = $localStorage.due[3];

                if ($localStorage.cart[3].comment != undefined) {
                    $scope.thursdayComment = $localStorage.cart[3].comment;
                } else {
                    $scope.thursdayComment = "";
                }
            } else {
                $scope.thursday = [];
                $scope.thursdaytotal = 0;
                $scope.thursdaydue = 0;
                $scope.thursdayComment = "";
            }
            $scope.weeks[0].name = 'Thursday';
            $scope.weeks[0].cart = $scope.thursday;
            $scope.weeks[0].total = $scope.thursdaytotal;
            $scope.weeks[0].due = $scope.thursdaydue;
            $scope.weeks[0].comment = $scope.thursdayComment;

            // $scope.$watch('weeks[0].comment', function(newval, oldval) {
            //     $localStorage.cart[3].comment = newval;
            //     console.log(newval);
            // }, true);

            $scope.prepareCheckoutInfo = function() {

            }

            $scope.docheckout = function() {
                var food = "";
                var foodid = "";
                var price = "";
                var quantity = "";
                var comment = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            foodid += foods.id + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += $localStorage.cart[i].comment + ";";
                        // console.log($localStorage.due[i]);
                        total += Number.parseInt($localStorage.total[i]);
                        due += Number.parseInt($localStorage.due[i]);
                        companysubsidy += Number.parseInt($scope.companysubsidy);
                    }

                }
                // console.log(due);
                // console.log(total);
                // console.log(price);

                var data = "token=" + $localStorage.data.data.token;
                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "getBalance",
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(result) {
                    $scope.balance = result.data.balance;
                    if (Number.parseInt($scope.balance) > due) {
                        var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&foodid=" + foodid + "&food=" + food + "&price=" + price + "&quantity=" + quantity + "&comment=" + comment;
                        console.log(data);
                        var link = $rootScope.mealimeter;
                        $http({
                            method: "POST",
                            url: link + "buywallet",
                            data: data,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                        }).then(function(result) {
                            delete $localStorage.due;
                            delete $localStorage.total;
                            delete $localStorage.cart;
                            delete $localStorage.cFreeDrinks;

                            swal("Great!", "Your order has been taken!", "success");
                            $('#modal-id').modal('hide');
                            $('.modal').modal('hide');
                            $window.location.href = "#/home";
                        }, function(error) {
                            console.log(error);
                        });
                    } else {
                        // alert("Your wallet balance isn't sufficient.Please Top Up");
                        $('#modal-id').modal('hide');
                        $('.modal').modal('hide');

                        swal({
                            title: "<small>Your wallet balance isn't sufficient</small>!",
                            text: "<a href='#/top-up' style='color:green'>Click here to top-up your wallet</a>",
                            html: true
                        });
                    }
                }, function(error) {
                    console.log(error);
                });

            }

            $scope.guestBuy = function() {
                console.log("guest but");
                swal({
                        title: "<small>Give us some quick info</small>",
                        text: "To help us get your meal to you fast<br />Don't worry your cart is saved.",
                        html: true,
                        // showCancelButton: true,
                        allowOutsideClick: true,
                        confirmButtonColor: "#8ac03e",
                        confirmButtonText: "Ok, Continue",
                        // cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            $localStorage.guestSignUp = true;
                            $window.location = "#/signup";
                        }
                        swal.close();
                    });
            }

            $scope.dobanktransfer = function() {
                var food = "";
                var foodid = "";
                var price = "";
                var quantity = "";
                var comment = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            foodid += foods.id + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += $localStorage.cart[i].comment + ";";
                        // console.log($localStorage.due[i]);
                        total += Number.parseInt($localStorage.total[i]);
                        due += Number.parseInt($localStorage.due[i]);
                        companysubsidy += Number.parseInt($scope.companysubsidy);
                    }
                }

                var randString = '';
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var i = 6; i > 0; --i) randString += chars[Math.floor(Math.random() * chars.length)];

                var compstring = "Paid by online transfer: " + randString.toUpperCase();

                var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&companystring=" + compstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&foodid=" + foodid + "&quantity=" + quantity + "&onlinetrans=" + randString.toUpperCase() + "&email=" + $localStorage.data.data.email + "&comment=" + comment;
                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "buycompany",
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(result) {

                    delete $localStorage.due;
                    delete $localStorage.total;
                    delete $localStorage.cart;
                    delete $localStorage.cFreeDrinks;

                    // swal("Great!", "Your order has been taken!", "success");
                    swal({
                        title: "Great <small>Your order has been taken!</small>!",
                        text: "<h3>Please send a transfer of <b>N" + due + "</b></h3> to <br /> Account Name: <b>Novedad limited</b><br />Account Number: <b>0140019459</b><br />Bank: <b>Guaranty Trust Bank</b><br /><br />With the refrence number <b>" + randString.toUpperCase() + "</b> in the description. to complete your order<br /><small>An email has also been sent to you</small>",
                        html: true
                    });

                    $('#modal-id').modal('hide');
                    $('.modal').modal('hide');

                    $window.location.href = "#/home";

                }, function(error) {
                    console.log(error);
                    swal("Oops!", "Something went wrong while placing your order. Try Again", "danger");
                });
            }

            $scope.$on('payOnlineTransfer', function(event, args) {
                console.log("i am the event");
                console.log(args);
                console.log(event);
            });

            $scope.dobanktransfer_ = function() {
                var food = "";
                var foodid = "";
                var price = "";
                var quantity = "";
                var comment = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            foodid += foods.id + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += $localStorage.cart[i].comment + ";";
                        // console.log($localStorage.due[i]);
                        total += Number.parseInt($localStorage.total[i]);
                        due += Number.parseInt($localStorage.due[i]);
                        companysubsidy += Number.parseInt($scope.companysubsidy);
                    }
                }

                var randString = '';
                var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                for (var i = 6; i > 0; --i) randString += chars[Math.floor(Math.random() * chars.length)];

                var compstring = "Paid by online transfer: " + randString.toUpperCase();

                var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&companystring=" + compstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&foodid=" + foodid + "&quantity=" + quantity + "&onlinetrans=" + randString.toUpperCase() + "&email=" + $localStorage.data.data.email + "&comment=" + comment;
                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "buycompany",
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(result) {}, function(error) {});
            }

            $scope.compSubmit = function() {
                var food = "";
                var foodid = "";
                var price = "";
                var quantity = "";
                var comment = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            foodid += foods.id + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        foodid += ";";
                        price += ";";
                        quantity += ";";
                        comment += $localStorage.cart[i].comment + ";";
                        // console.log($localStorage.due[i]);
                        total += Number.parseInt($localStorage.total[i]);
                        due += Number.parseInt($localStorage.due[i]);
                        companysubsidy += Number.parseInt($scope.companysubsidy);
                    }

                }

                var compstring = "Paid by " + $localStorage.data.officedata.office_name;

                var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&companystring=" + compstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&foodid=" + foodid + "&quantity=" + quantity + "&comment=" + comment;
                var link = $rootScope.mealimeter;
                $http({
                    method: "POST",
                    url: link + "buycompany",
                    data: data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(result) {

                    delete $localStorage.due;
                    delete $localStorage.total;
                    delete $localStorage.cart;
                    delete $localStorage.cFreeDrinks;

                    // swal("Great!", "Your order has been taken! And your company would be contacted", "success");
                    swal("Great!", "Your order has been taken!", "success");

                    $('#modal-id').modal('hide');
                    $('.modal').modal('hide');

                    $window.location.href = "#/home";

                }, function(error) {
                    console.log(error);
                    swal("Oops!", "Something went wrong while placing your order. Try Again", "danger");
                });
            }

        }
    }]);