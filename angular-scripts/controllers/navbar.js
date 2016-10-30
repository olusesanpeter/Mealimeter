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
	  	var data = "token="+$localStorage.data.data.token;
		var link = $rootScope.mealimeter;
	$http({
	    method : "POST",
	    url: link+"getBalance",
	    data: data,
	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
	}).then(function(result) {
	  $scope.balance = result.data.balance;
	}, function(error) {
	  console.log(error);
	});

  // console.log($scope.show);
	

  }]);
