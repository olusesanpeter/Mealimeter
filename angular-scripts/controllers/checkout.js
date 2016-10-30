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

    $scope.redirect = function(day){
  		$window.location.href = "#/pre-order/"+day;
	};
	$scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
	console.log("dsfvsdsds");
	console.log($localStorage.cart[0]);
	console.log($localStorage.total[0]);
	if($localStorage.cart[0] != undefined){
		$scope.monday = $localStorage.cart[0];
		$scope.mondaytotal = $localStorage.total[0];
		$scope.mondaydue = $localStorage.total[0];
	}
	else{
		$scope.monday = [];
		$scope.mondaytotal = 0;
		$scope.mondaydue = 0;
	}

	if($localStorage.cart[1] != undefined){
		$scope.tuesday = $localStorage.cart[1];
		$scope.tuesdaytotal = $localStorage.total[1];
		$scope.tuesdaydue = $localStorage.total[1];
	}
	else{
		$scope.tuesday = [];
		$scope.tuesdaytotal = 0;
		$scope.tuesdaydue= 0;
	}

	if($localStorage.cart[2] != undefined){
		$scope.wednesday = $localStorage.cart[2];
		$scope.wednesdaytotal = $localStorage.total[2];
		$scope.wednesdaydue = $localStorage.total[2];
	}
	else{
		$scope.wednesday = [];
		$scope.wednesdaytotal = 0;
		$scope.wednesdaydue = 0;
	}

	if($localStorage.cart[3] != undefined){
		$scope.thursday = $localStorage.cart[3];
		$scope.thrusdaytotal = $localStorage.total[3];
		$scope.thursdaydue = $localStorage.total[3];
	}
	else{
		$scope.thursday = [];
		$scope.thursdaytotal = 0;
		$scope.thursdaydue= 0;
	}

	if($localStorage.cart[4] != undefined){
		$scope.friday = $localStorage.cart[4];
		$scope.fridaytotal = $localStorage.total[4];
		$scope.fridaydue = $localStorage.total[4];
	}
	else{
		$scope.friday = [];
		$scope.fridaytotal = 0;
		$scope.fridaydue = 0;
	}
  }]);
