'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('LoginCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	//////data from login
    $scope.logins = function(data){

    	// alert(data.usernamefield);
    	// alert(data.passwordfield);
    	var link = $rootScope.mealimeter;
    	var logindata = "email="+data.usernamefield+"&password="+data.passwordfield;
    	console.log(logindata);
    	$http({
    	    method : "POST",
    	    url: link+"login",
    	    data: logindata,
    	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
    	}).then(function(response) {
    	 	console.log(response.data);
    	 	
    	 	if(response.data.data != undefined){
		    	if(response.data.error == false){
		    		console.log("got here");
		    		$localStorage.data = response.data;
					$window.location.href="#/pre-order";
		    	}
	    	}
	    	else{
	    		if(response.data.description == "Not Activated"){
					$('#error').html('Not Activated Your Account <a href="#fakelink" class="alert-link">Please check your email</a>.');
					$('#error').show();
	    		}
	    		else{
	    			$('#error').html('Incorrect Credentials <a href="#fakelink" class="alert-link">Please try again</a>.');
	    			$('#error').show();

	    		}
	    	}
    	}, function(error) {
    	  console.log(error);
    	});
    };

  }]);
