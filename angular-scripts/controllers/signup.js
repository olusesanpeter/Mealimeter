'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('SignupCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	//////data from login
    $scope.register = function(data){
    	
    	var link = $rootScope.mealimeter;
    	var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&password="+data.passwordfield;
    	console.log(registerdata);
    	$http({
    	    method : "POST",
    	    url: link+"register",
    	    data: registerdata,
    	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
    	})
    	.then(function(response) {
    	 	console.log(response.data);
    	 	
    	 	if(response.data.data != undefined){
		    	if(response.data.error == false){
		    		console.log("Registration Successful");
		    		$localStorage.data = response.data.data;
					$window.location.href="#/login";
		    	}
	    	}
    	}, 
    	function(error) {
    	  console.log(error);
    	});
    	$http({
    		method : "POST",
    		url: link+"getCompanies",
		    dataType: "json"
		})
		.then(function(response) {
    	 	console.log(response.COMPANIES);
    	}, 
    	function(error) {
    	  console.log(error);
    	});
    };

  }]);









