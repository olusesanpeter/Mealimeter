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
  }]);
