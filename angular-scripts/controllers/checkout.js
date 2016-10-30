'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('CheckoutCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {

    $scope.redirect = function(){
  		$window.location.href = "#/pre-order/monday";
	};
	$scope.redirect2 = function(){
  		$window.location.href = "#/pre-order/tuesday";
	};
	$scope.redirect3 = function(){
  		$window.location.href = "#/pre-order/wednesday";
	};
	$scope.redirect4 = function(){
  		$window.location.href = "#/pre-order/thursday";
	};
	$scope.redirect5 = function(){
  		$window.location.href = "#/pre-order/friday";
	};
	$scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
	if($localStorage.cart[0] != undefined){
		$scope.monday = $localStorage.cart[0];
	}
	else{
		$scope.monday = [];
	}

	if($localStorage.cart[1] != undefined){
		$scope.tuesday = $localStorage.cart[1];
	}
	else{
		$scope.tuesday = [];
	}

	if($localStorage.cart[2] != undefined){
		$scope.wednesday = $localStorage.cart[2];
	}
	else{
		$scope.wednesday = [];
	}

	if($localStorage.cart[3] != undefined){
		$scope.thursday = $localStorage.cart[3];
	}
	else{
		$scope.thursday = [];
	}

	if($localStorage.cart[4] != undefined){
		$scope.friday = $localStorage.cart[4];
	}
	else{
		$scope.friday = [];
	}
  }]);
