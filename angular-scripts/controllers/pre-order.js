'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('Pre-orderCtrl',['$scope','$http','$rootScope', '$scope', '$state', '$window', '$localStorage','$location',function ($scope,$http,$rootScope, $scope, $state, $window, $localStorage,$location) {
  	//////meant for localstorage
    var logindata = {
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
	var data = 
	$http({
	    method : "POST",
	    url: $,
	    data: data,
	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
	}).then(function(result) {
	  console.log(result);
	}, function(error) {
	  console.log(error);
	});

  }]);
