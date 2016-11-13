'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp').controller("payCtrl", ['$rootScope', '$scope', '$sce', '$localStorage', '$window', '$http', '$route', function($rootScope, $scope, $sce, $localStorage, $window, $http, $route) {

        var pb = document.getElementById("payBtn");
        pb.innerHTML = "Pay Online";

        $scope.ngFn = function() {

            pb.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Loading...";
            console.log($localStorage.data);

            var handler = PaystackPop.setup({
                key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
                email: $localStorage.data.data.email,
                amount: $scope.amt * 100,
                ref: "MM_" + Math.floor(Math.random() * 100000) + "_" + Math.floor(Math.random() * 100000),
                metadata: {
                    custom_fields: [{
                        username: $localStorage.data.data.username
                    }]
                },
                callback: function(response) {
                    console.log(response);
                    // alert('success. transaction ref is ' + response.reference);
                    var Data = "token=" + $localStorage.data.data.token + "&amount=" + $scope.amt;
                    console.log(Data);
                    var link = $rootScope.mealimeter;
                    $http({
                        method: "POST",
                        url: link + "topup",
                        data: Data,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                    }).then(function(result) {
                        pb.innerHTML = "Pay Online";

                        // alert($scope.amt + " has been added to your wallet");
                        swal("Success!", $scope.amt + " has been added to your wallet", "success");

                        $route.reload();
                    }, function(error) {
                        pb.innerHTML = "Pay Online";
                        console.log(error);
                    });
                },
                onClose: function() {
                    pb.innerHTML = "Pay Online";
                    // alert('No transaction was carried out');
                    swal("Cancelled", "No transaction was carried out", "error");
                }
            });
            handler.openIframe();
        };
    }])
    .controller('Top-upCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$sce', function($scope, $http, $rootScope, $window, $localStorage, $location, $sce) {
        if ($localStorage.data == undefined) {
            $window.location.href = "#/login";
        } else {
            $scope.showframe = false;
            var reference = "";
            $scope.topup = function(data) {
                console.log(data);
                var amount = data.amount;
                console.log($localStorage.data);
                var username = $localStorage.data.data.username;
                var email = $localStorage.data.data.email;
                var token = $localStorage.data.data.token;
                var link = $rootScope.mealimeter;

                var Data = "token=" + token;
                $http({
                    method: "POST",
                    url: link + "getHashNow",
                    data: Data,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
                }).then(function(response) {
                    console.log(response);
                    amount = amount * 100;
                    var reference = response.data;
                    var transData = { "reference": reference, "amount": amount, "email": email };
                    var urls = "https://api.paystack.co/transaction/initialize";
                    $http({
                        method: "POST",
                        url: urls,
                        data: transData,
                        headers: {
                            "Authorization": "Bearer sk_live_292afa571819297a16bc5352840419a3704e1c62",
                            "Content-Type": "application/json"
                        },
                        dataType: "json",
                    }).then(function(response2) {
                        console.log(response2);
                        // alert('success. transaction ref is ' + response.trxref);
                        // console.log(response);
                        var reference = response2.data.data.reference;
                        var access_code = response2.data.data.access_code;
                        var authorization_url = response2.data.data.authorization_url;
                        $scope.imgsrc = $sce.trustAsResourceUrl(authorization_url);
                        $scope.showframe = true;
                    }, function(error) {
                        console.log(error);
                    });

                }, function(error) {
                    console.log(error);
                });

                function payWithPaystack() {
                    var handler = PaystackPop.setup({
                        key: 'pk_live_71b0b2b62aea6d0914aade795f262a100cc72e3c',
                        email: 'udaleamehoj@gmail.com',
                        amount: 10000,
                        ref: reference,
                        callback: function(response) {

                            alert('success. transaction ref is ' + response.trxref);
                        },
                        onClose: function() {
                            alert(reference);
                            console.log(reference);
                            alert(reference);
                            alert('window closed');
                        }
                    });
                    handler.openIframe();
                }
            };
            $scope.closeframe = function() {
                $scope.showframe = false;
                // var urls = "https://api.paystack.co/transaction/verify/"+ reference;
                // $http({
                //     method : "GET",
                //     url: urls,
                //     headers:{
                //     		"Authorization":"Bearer sk_test_4e75ca179144f1d25ea4f2865bd6361323c46fb0",
                //     		"Content-Type":"application/json"
                //     	},
                //     dataType: "json", 
                // }).then(function(response2){
                // 	console.log(response2);
                // 	if(response2.data.data.status == "success"){
                // 		var amount = response2.data.amount;
                // 		amount /= 100;
                // 		var topupdata = 'token='+token+'&amount='+amount;
                // 		$http({
                // 		    method : "POST",
                // 		    url: link+"topup",
                // 		    data: topupdata,
                // 	headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
                // 		}).then(function(response) {
                // 			console.log(response);
                // 		},function(error){
                // 			console.log(error);
                // 		});
                // 	}
                // 	else{
                // 		// $('#errortopup').modal('toggle');
                // 		alert("do not add to wallet");
                // 	}
                // },function(error){
                // 	console.log(error);
                // });
            }
        }
    }])
    ;

 