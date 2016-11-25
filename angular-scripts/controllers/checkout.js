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
        var price = "";
        var quantity = "";
        var total = 0;
        var due = 0;
        var companysubsidy = 0;
        for (var i = 0; i < 5; i++) {
            if ($localStorage.cart[i] == undefined) {
                food += ";";
                price += ";";
                quantity += ";";
            } else {
                angular.forEach($localStorage.cart[i], function(foods) {
                    food += foods.mainmeal + " + " + foods.additive + ",.,";
                    price += foods.price + ",.,";
                    quantity += foods.quantity + ",.,";
                });
                food += ";";
                price += ";";
                quantity += ";";
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
        if ($localStorage.freeDrinks != undefined) {
            var s = $localStorage.freeDrinks;
            drinksstring = " Refer Selection: " + drinksstring + JSON.stringify(s);
            console.log(drinksstring);
        }
        if ($localStorage.cFreeDrinks != undefined) {
            var s = $localStorage.cFreeDrinks;
            drinksstring = " Combo Selection: " + drinksstring + JSON.stringify(s);
            console.log(drinksstring);
        }

        $scope.ngFn = function() {
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
                    var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&quantity=" + quantity;
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
                        // alert("Your order has been taken");
                        swal("Great!", "Your order has been taken!", "success");

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
        if ($localStorage.freeDrinks != undefined) {
            var s = $localStorage.freeDrinks;
            drinksstring = " Refer Selection: " + drinksstring + JSON.stringify(s);
            console.log(drinksstring);
        }
        if ($localStorage.cFreeDrinks != undefined) {
            var s = $localStorage.cFreeDrinks;
            drinksstring = " Combo Selection: " + drinksstring + JSON.stringify(s);
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
                $window.location.href = "#/pre-order/" + day;
            };
            if ($localStorage.guest == true) {
                $scope.companysubsidy = 0;
            } else {
                $scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
            }
            $scope.weeks = [];
            $scope.weeks[0] = [];
            $scope.weeks[1] = [];
            // $scope.weeks[1] = [];
            // $scope.weeks[2] = [];
            // $scope.weeks[3] = [];
            // $scope.weeks[4] = [];
            // if ($localStorage.cart[0] != undefined || $localStorage.cart[0] != null) {
            //     $scope.monday = $localStorage.cart[0];
            //     $scope.mondaytotal = $localStorage.total[0];
            //     $scope.mondaydue = $localStorage.due[0];
            // } else {
            //     $scope.monday = [];
            //     $scope.mondaytotal = 0;
            //     $scope.mondaydue = 0;
            // }
            // $scope.weeks[0].name = 'Monday';
            // $scope.weeks[0].cart = $scope.monday;
            // $scope.weeks[0].total = $scope.mondaytotal;
            // $scope.weeks[0].due = $scope.mondaydue;

            if ($localStorage.cart[1] != undefined || $localStorage.cart[1] != null) {
                $scope.tuesday = $localStorage.cart[1];
                $scope.tuesdaytotal = $localStorage.total[1];
                $scope.tuesdaydue = $localStorage.due[1];
            } else {
                $scope.tuesday = [];
                $scope.tuesdaytotal = 0;
                $scope.tuesdaydue = 0;
            }
            $scope.weeks[1].name = 'Tuesday';
            $scope.weeks[1].cart = $scope.tuesday;
            $scope.weeks[1].total = $scope.tuesdaytotal;
            $scope.weeks[1].due = $scope.tuesdaydue;


            // if ($localStorage.cart[2] != undefined || $localStorage.cart[2] != null) {
            //     $scope.wednesday = $localStorage.cart[2];
            //     $scope.wednesdaytotal = $localStorage.total[2];
            //     $scope.wednesdaydue = $localStorage.due[2];
            // } else {
            //     $scope.wednesday = [];
            //     $scope.wednesdaytotal = 0;
            //     $scope.wednesdaydue = 0;
            // }
            // $scope.weeks[2].name = 'Wednesday';
            // $scope.weeks[2].cart = $scope.wednesday;
            // $scope.weeks[2].total = $scope.wednesdaytotal;
            // $scope.weeks[2].due = $scope.wednesdaydue;

            if ($localStorage.cart[3] != undefined || $localStorage.cart[3] != null) {
                $scope.thursday = $localStorage.cart[3];
                $scope.thursdaytotal = $localStorage.total[3];
                console.log($localStorage.total[3]);
                console.log($localStorage.due[3]);
                $scope.thursdaydue = $localStorage.due[3];
            } else {
                $scope.thursday = [];
                $scope.thursdaytotal = 0;
                $scope.thursdaydue = 0;
            }
            $scope.weeks[0].name = 'Thursday';
            $scope.weeks[0].cart = $scope.thursday;
            $scope.weeks[0].total = $scope.thursdaytotal;
            $scope.weeks[0].due = $scope.thursdaydue;

            // if ($localStorage.cart[4] != undefined || $localStorage.cart[4] != null) {
            //     $scope.friday = $localStorage.cart[4];
            //     $scope.fridaytotal = $localStorage.total[4];
            //     $scope.fridaydue = $localStorage.due[4];
            // } else {
            //     $scope.friday = [];
            //     $scope.fridaytotal = 0;
            //     $scope.fridaydue = 0;
            // }
            // $scope.weeks[4].name = 'Friday';
            // $scope.weeks[4].cart = $scope.friday;
            // $scope.weeks[4].total = $scope.fridaytotal;
            // $scope.weeks[4].due = $scope.fridaydue;

            $scope.prepareCheckoutInfo = function() {

            }

            $scope.docheckout = function() {
                var food = "";
                var price = "";
                var quantity = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        price += ";";
                        quantity += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        price += ";";
                        quantity += ";";
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
                        var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&quantity=" + quantity;
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

                            swal("Great!", "Your order has been taken!", "success");
                            $('#modal-id').modal('hide');
                            $window.location.href = "#/home";
                        }, function(error) {
                            console.log(error);
                        });
                    } else {
                        // alert("Your wallet balance isn't sufficient.Please Top Up");
                        $('#modal-id').modal('hide');
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
                            $window.location = "#/signup";
                        }
                        swal.close();
                    });
            }

            $scope.compSubmit = function() {
                // var cName = $("input[name=company_name]").val();
                // var cPhone = $("input[name=company_phone]").val();
                // var cAddress = $("input[name=company_address]").val();
                // var cEmail = $("input[name=company_email]").val();

                // if (cName != "" && cPhone != "" && cAddress != "" && cEmail != "") {

                // var cN = $("input[name=company_name]");
                // var cP = $("input[name=company_phone]");
                // var cA = $("input[name=company_address]");
                // var cE = $("input[name=company_email]");

                // cN.prop("disabled", true);
                // cP.prop("disabled", true);
                // cA.prop("disabled", true);
                // cE.prop("disabled", true);
                // $("#submitComp").html("<i class='fa fa-spin fa-spinner'></i>");
                // $("#submitComp").prop("disabled", true);

                var food = "";
                var price = "";
                var quantity = "";
                var total = 0;
                var due = 0;
                var companysubsidy = 0;
                for (var i = 0; i < 5; i++) {
                    if ($localStorage.cart[i] == undefined) {
                        food += ";";
                        price += ";";
                        quantity += ";";
                    } else {
                        angular.forEach($localStorage.cart[i], function(foods) {
                            food += foods.mainmeal + " + " + foods.additive + ",.,";
                            price += foods.price + ",.,";
                            quantity += foods.quantity + ",.,";
                        });
                        food += ";";
                        price += ";";
                        quantity += ";";
                        // console.log($localStorage.due[i]);
                        total += Number.parseInt($localStorage.total[i]);
                        due += Number.parseInt($localStorage.due[i]);
                        companysubsidy += Number.parseInt($scope.companysubsidy);
                    }

                }

                // var compstring = cName + " - " + cPhone + " - " + cAddress + " - " + cEmail;
                var compstring = "Paid by " + $localStorage.data.officedata.office_name;

                var data = "token=" + $localStorage.data.data.token + "&drinksstring=" + drinksstring + "&companystring=" + compstring + "&refcode=" + $localStorage.refcode + "&refrefcode=" + $localStorage.refrefcode + "&total=" + total + "&subsidy=" + companysubsidy + "&paid=" + due + "&food=" + food + "&price=" + price + "&quantity=" + quantity;
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

                    // swal("Great!", "Your order has been taken! And your company would be contacted", "success");
                    swal("Great!", "Your order has been taken!", "success");

                    $('#modal-id').modal('hide');

                    // cN.prop("disabled", false);
                    // cP.prop("disabled", false);
                    // cA.prop("disabled", false);
                    // cE.prop("disabled", false);
                    // $("#submitComp").html("Submit");
                    // $("#submitComp").prop("disabled", false);

                    $window.location.href = "#/home";

                }, function(error) {
                    console.log(error);
                    swal("Oops!", "Something went wrong while placing your order. Try Again", "danger");

                    // cN.prop("disabled", false);
                    // cP.prop("disabled", false);
                    // cA.prop("disabled", false);
                    // cE.prop("disabled", false);
                    // $("#submitComp").html("Submit");
                    // $("#submitComp").prop("disabled", false);
                });

                // } else {
                //     toastr.warning("All fields must be completed");
                // }
            }


        }
    }]);