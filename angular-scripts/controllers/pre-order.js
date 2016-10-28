'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('preorderCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	//////data from login
 //    $localStorage.data = {
	// 	"error": false,
	// 	"data": {
	// 		"token": "79ebba912dd57c6b6d7e58653ed10a24",
	// 		"username": "godwin",
	// 		"email": "olatundegodwin1@gmail.com"
	// 	},
	// 	"admin": false,
	// 	"officedata": {
	// 		"office_name": "Chevron",
	// 		"office_address": "Lekki",
	// 		"office_location": "Island",
	// 		"office_admin": "Chevron",
	// 		"office_payment_type": "company",
	// 		"office_payment_status": "",
	// 		"office_payment_amount": "2000"
	// 	},
	// 	"description": "Success"
	// };/////online
	$localStorage.data = {
	  "error": false,
	  "data": {
	    "token": "5d479b28703f21cc5810335a9d23d9a6",
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
	}
	if($localStorage.cart != undefined){
		$scope.cart = $localStorage.cart;
		$scope.total = $localStorage.total;
	}
	else{
		$scope.cart = [];
		$scope.total = 0;
	}
	
	var data = "token="+$localStorage.data.data.token;
	var link = $rootScope.mealimeter;
	$scope.username =  $localStorage.data.data.username;
	console.log($localStorage.data);
	$scope.drinks = [];
	$scope.snacks = [];
	$scope.food = [];
	$http({
	    method : "POST",
	    url: link+"getmealspreorder",
	    data: data,
	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
	}).then(function(result) {
		console.log(result);
	  $scope.snacks = result.data.snacks;
	  $scope.drinks = result.data.drinks;
	  $scope.meals = result.data.preorderList;
	  console.log($scope.meals);
	  console.log($scope.drinks);
	  console.log($scope.snacks);

	}, function(error) {
	  console.log(error);
	});
	$scope.addtocart = function(id,len){
		var main = $scope.meals[0].options[len].option.name;
		var additive = $scope.meals[0].options[len].option.additives[id];
		var price = $scope.meals[0].options[len].option.prices[id];
		if(len == 0){
			var newid = (len + 1)*(id + 1);
		}
		else{
			var prevsize = 0;
			for(var i = 0;i<len;i++){
				prevsize += $scope.meals[0].options[i].option.additives.length;
			}
			var newid = prevsize + (id+1);
		}
		var t = false;
		var currentposition = 0;
		var total = 0;
		for (var i = 0; i < $scope.cart.length; i++) {
			if(newid == $scope.cart[i].id){
				t = true;
				currentposition = i;
			}
			total += Number.parseInt($scope.cart[i].price);
		}
		if(t == false){
			$scope.cart.push({'id':newid,'mainmeal':main,'additive':additive,'price':price,'quantity':1});
			total += Number.parseInt(price);
		}
		else{
			var oldquantity = $scope.cart[currentposition].quantity;
			var newquantity = oldquantity+1;
			var oldprice = $scope.cart[currentposition].price;
			var newprice = ((oldprice)/oldquantity) * newquantity;
			total = total - oldprice + newprice;
			$scope.cart[currentposition] = {'id':newid,'mainmeal':main,'additive':additive,'price':newprice,'quantity':newquantity};
		}
		$scope.total = total;
		$localStorage.cart = $scope.cart;
		$localStorage.total = $scope.total;
	}

  }]);
