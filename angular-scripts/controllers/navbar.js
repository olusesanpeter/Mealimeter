'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('inviteCtrl', ['$scope', '$routeParams', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $routeParams, $http, $rootScope, $window, $localStorage, $location, $timeout) {
        var num = 1;
        $scope.list = [num];
        $scope.done = [];
        $scope.raters = [];
        $scope.ratings = [];
        $scope.rateWeek;

        if ($routeParams.ref != undefined) {
            $localStorage.refrefcode = $routeParams.ref;
            console.log($localStorage.refrefcode);
        } else {
            if ($localStorage.refrefcode == undefined) {
                $localStorage.refrefcode = "";
            }
        }

        $scope.showrates = function() {
            var obj = $.extend({}, $scope.ratings);
            console.log(obj);

            $scope.submitRate(obj);
        }
        $scope.dontRate = function() {
            var obj = { 0: 0 };
            $scope.submitRate(obj);
        }
        $scope.submitRate = function(ratobject) {
            var ratings = JSON.stringify(ratobject);
            var submitratedata = "token=" + $localStorage.data.data.token + "&ratings=" + ratings + "&week=" + $scope.rateWeek;

            console.log(submitratedata);

            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "submitrating",
                data: submitratedata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                    var res = response.data;
                    console.log(res);
                    $('#ratingModal').modal('hide');
                },

                function(error) {
                    console.log(error);
                });
        }
        $scope.displayRating = function() {
            var getratedata = "token=" + $localStorage.data.data.token;

            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "checkrating",
                data: getratedata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                    var res = response.data;
                    console.log(res);
                    if (response.data.error == false) {
                        $scope.rateWeek = res.description.week;
                        $scope.rateNames = res.description.name;
                        $scope.rateIds = res.description.id;
                        $scope.rateQuantity = res.description.quantity;

                        for (var k = 0; k < $scope.rateNames.length; k++) {
                            for (var l = 0; l < $scope.rateNames[k].length; l++) {
                                var r = {
                                    name: $scope.rateNames[k][l],
                                    id: $scope.rateIds[k][l],
                                    quantity: $scope.rateQuantity[k][l]
                                }
                                $scope.raters.push(r);
                            }
                        }
                        console.log($scope.raters);

                        $('#ratingModal').modal('show');
                        console.log("Something should happen");
                    } else {
                        console.log("nothing should happen");
                    }
                },

                function(error) {
                    console.log(error);
                });
        }

        if ($localStorage.guest != true) {
            $scope.refcode = $localStorage.data.data.refcode;
            $scope.displayRating();
        } else {
            if ($localStorage.refcode == undefined) {
                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                var result = '';
                for (var i = 7; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                $localStorage.refcode = result;
            }
            if ($localStorage.refrefcode == undefined) {
                $localStorage.refrefcode = "";
            }
        }

        $scope.addMore = function() {
            num++;
            console.log(num);
            $scope.list.push(num);
            console.log($scope.list);
        }

        $scope.remove = function(item) {
            var index = $scope.list.indexOf(item);
            if (index > -1) {
                $scope.list.splice(index, 1);
            }
        }

        $scope.sendToAll = function() {
            $("#sendallBtn").prop("disabled", true);

            $scope.list.forEach(function(item) {
                $scope.sendInvite(item);
            }, this);
        }

        function checkRegex(str, regex) {
            return regex.test(str);
        }

        $scope.sendInvite = function(item) {
            $('#row' + item).removeClass('animated shake');


            var sendBtn = $("#sendBtn" + item);

            var nameIn = $("#invite-name" + item);
            var emailIn = $("#invite-email" + item);
            var phoneIn = $("#invite-phone" + item);

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

            var invitedata = "personname=" + $localStorage.data.data.username +
                "&name=" + name + "&refcode=" + $scope.refcode + "&email=" + email;

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
                        $scope.done.push(user);
                        $scope.remove(item);
                    } else {
                        sendBtn.html("Send");
                        sendBtn.prop('disabled', false);
                        nameIn.prop('disabled', false);
                        emailIn.prop('disabled', false);
                        phoneIn.prop('disabled', false);
                        console.log(item);
                        $('#row' + item).addClass('animated shake');
                    }
                },

                function(error) {
                    console.log(error);
                });

        }
    }])
    .controller('navbarCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', function($scope, $http, $rootScope, $window, $localStorage, $location) {
        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $window.location.href = "#/login";
        }

        if ($localStorage.newCartNum != undefined) {
            $rootScope.newCartNum = $localStorage.newCartNum;
            $scope.newCartNum = $rootScope.newCartNum;
        } else {
            $rootScope.newCartNum = 0;
            $scope.newCartNum = 0;
        }

        $rootScope.$watch('newCartNum', function() {
            $scope.newCartNum = $rootScope.newCartNum;
        });

        if ($localStorage.data == undefined && $localStorage.guest == undefined) {
            $scope.show = false;
        } else {
            $scope.show = true;
            if ($localStorage.guest == true) {
                $scope.username = "guest";
            } else {
                $scope.username = $localStorage.data.data.username;
            }
        }

        $scope.signout = function() {
            delete $localStorage.data;
            delete $localStorage.cart;
            delete $localStorage.newCart;
            delete $localStorage.newCartNum;
            delete $localStorage.newTotalPrice;
            delete $localStorage.total;
            delete $localStorage.due;
            delete $localStorage.guest;

            $window.location.href = "#/login";
        }

        if ($localStorage.guest == true) {
            $scope.balance = 0;
        } else {
            console.log($localStorage.data);
            var data = "token=" + $localStorage.data.data.token;
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "getBalance",
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(result) {
                $scope.balance = result.data.balance;
                $rootScope.balance = result.data.balance;
            }, function(error) {
                console.log(error);
            });
        }

        $scope.gotoSignUp = function() {
            console.log("sign up");
            $window.location.href = "#/signup";
        }
        $scope.gotoLogin = function() {
            console.log("log in");
            $window.location.href = "#/login";
        }

        if ($localStorage.foodEvent != undefined) {
            $rootScope.foodEvent = $localStorage.foodEvent;
        }
        $scope.beginFoodEvent = function() {
            $rootScope.foodEvent = 'active';
            $localStorage.foodEvent = $rootScope.foodEvent;

            $("#loginmodal").modal('hide');
            $('#loginmodal').on('hidden.bs.modal', function(e) {
                // $route.reload();
            });
            console.log($rootScope.foodEvent);
        }

        // console.log($scope.show);


    }]);