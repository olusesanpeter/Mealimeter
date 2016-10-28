'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('Top-upCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location','$sce',function ($scope,$http,$rootScope, $window, $localStorage,$location,$sce) {
        $localStorage.data = {
    		"error": false,
    		"data": {
    			"token": "79ebba912dd57c6b6d7e58653ed10a24",
    			"username": "godwin",
    			"email": "olatundegodwin1@gmail.com"
    		},
    		"admin": false,
    		"officedata": {
    			"office_name": "Chevron",
    			"office_address": "Lekki",
    			"office_location": "Island",
    			"office_admin": "Chevron",
    			"office_payment_type": "company",
    			"office_payment_status": "",
    			"office_payment_amount": "2000"
    		},
    		"description": "Success"
    	};
    	$scope.showframe = false;
    	var reference = "";
    $scope.topup = function(data){
    	console.log(data);
		var amount = data.amount;
		console.log($localStorage.data);
		var username = $localStorage.data.data.username;
		var email = $localStorage.data.data.email;
		var token = $localStorage.data.data.token;
		var link = $rootScope.mealimeter;

		var Data = "token="+token;
		$http({
		    method : "POST",
		    url: link+"getHashNow",
		    data: Data,
		    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
		}).then(function(response) {
			console.log(response);
	    	amount = amount * 100;
	    	var reference = response.data;
	    	var transData = {"reference": reference, "amount": amount, "email": email};
			var urls = "https://api.paystack.co/transaction/initialize";
			$http({
			  method : "POST",
			  url: urls,
			  data: transData,
			  headers:{
			  		"Authorization":"Bearer sk_test_4e75ca179144f1d25ea4f2865bd6361323c46fb0",
			  		"Content-Type":"application/json"
			  	},
			  dataType: "json", 
			}).then(function(response2){
				console.log(response2);
	    	  	  // alert('success. transaction ref is ' + response.trxref);
	    	  	  // console.log(response);
	    	  	  var reference = response2.data.data.reference;
	    	  	  var access_code = response2.data.data.access_code;
	    	  	  var authorization_url = response2.data.data.authorization_url;
	    	  	  $scope.imgsrc = $sce.trustAsResourceUrl(authorization_url);
	    	  	  $scope.showframe = true;
	    	  },function(error){
	    	  	console.log(error);
	    	  });
	    	  
		}, function(error) {
		  console.log(error);
		});

    	function payWithPaystack(){
    	  var handler = PaystackPop.setup({
    	    key: 'pk_test_2bdfcf7c1069c623162d771f1a4e9428580b77e8',
    	    email: 'udaleamehoj@gmail.com',
    	    amount: 10000,
    	    ref: reference,
    	    callback: function(response){

    	        alert('success. transaction ref is ' + response.trxref);
    	    },
    	    onClose: function(){
    	    	alert(reference);
    	    	console.log(reference);
    	    	alert(reference);
    	        alert('window closed');
    	    }
    	  });
    	  handler.openIframe();
    	}
    };
    $scope.closeframe = function(){
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
  }]);
