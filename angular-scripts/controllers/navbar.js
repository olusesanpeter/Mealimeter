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
	if($localStorage.data == undefined){
		$scope.show = false;
	}
	else{
		$scope.show = true;
		$scope.username =  $localStorage.data.data.username;
	}

	$scope.signout = function(){
		delete $localStorage.data;
		delete $localStorage.cart;
		delete $localStorage.total;
		delete $localStorage.due;
		$window.location.href = "#/login";
	}

  // console.log($scope.show);
	

  }]);
