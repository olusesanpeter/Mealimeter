'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('preorderctrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	//////meant for localstorage
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
	var data = "token="+$localStorage.data.data.token;
	var link = $rootScope.mealimeter;
	$scope.drinks = [];
	$scope.snacks = [];
	$scope.food = [];
	$http({
	    method : "POST",
	    url: link+"getmealspreorder",
	    data: data,
	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
	}).then(function(result) {
	  $scope.snacks = result.data.snacks;
	  $scope.drinks = result.data.drinks;
	  $scope.food = result.data.preorderList;

	}, function(error) {
	  console.log(error);
	});

  }]);
