'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('navbarCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	

	var data = "token="+$localStorage.data.token;
	var link = $rootScope.mealimeter;
	$scope.username =  $localStorage.data.username;
	console.log($localStorage.data);
	

  }]);
