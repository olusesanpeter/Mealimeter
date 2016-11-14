'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
    .controller('inviteCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$timeout', function($scope, $http, $rootScope, $window, $localStorage, $location, $timeout) {
        var num = 1;
        $scope.list = [num];
        $scope.done = [];
        if ($localStorage.guest != true) {
            $scope.refcode = $localStorage.data.data.refcode;
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

            $timeout(function() {}, 2000);
        }
    }])
    .controller('navbarCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', function($scope, $http, $rootScope, $window, $localStorage, $location) {
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
            delete $localStorage.total;
            delete $localStorage.due;
            delete $localStorage.guest;

            $window.location.href = "#/login";
        }

        if ($localStorage.guest == true) {
            $scope.balance = 0;
        } else {
            var data = "token=" + $localStorage.data.data.token;
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "getBalance",
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(result) {
                $scope.balance = result.data.balance;
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

        // console.log($scope.show);


    }]);