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
  	var data = "token="+$localStorage.data.token;
	var link = $rootScope.mealimeter;
	$scope.username =  $localStorage.data.username;
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
	  $scope.snacks = result.data.snacks;
	  $scope.drinks = result.data.drinks;
	  $scope.meals = result.data.preorderList;
	  console.log($scope.meals);
	  console.log($scope.drinks);
	  console.log($scope.snacks);

	}, function(error) {
	  console.log(error);
	});

  }]);
