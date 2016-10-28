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
  	var link = $rootScope.mealimeter;
  	$http({
    		method : "GET",
    		url: link+"getCompanies"
		}).then(function(response) {
		console.log(response);
	  	$scope.companies = response.data.companies;
	  	console.log($scope.companies);
		}, 
		function(error) {
		  console.log(error);
		});
    	$scope.register = function(data){

    	console.log(data.checked);
        if (data.checked == true){
        var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&password="+data.passwordfield+"&officename="+data.officename+"&officeaddress="+data.officeaddress+"&officelocation="+data.officelocation;
        }
        else{
        var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&password="+data.passwordfield+"&officeid="+data.companies;
        }
    	
    	$http({
    	    method : "POST",
    	    url: link+"register",
    	    data: registerdata,
    	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
    	   }).then(function(response) {
    	 	console.log(response.data.result);
		    	if(response.data.result.error == false){
		    		console.log("Registration Successful");
					$window.location.href="#/login";
		    	}
                else{
                    console.log("Registration Failed");
                    $scope.error = response.data.result.errors[0];
                }
    	},
    	function(error) {
    	  console.log(error);
    	});

    	

    };

  }]);









