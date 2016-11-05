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
        console.log(data);
        console.log(data.passwordfield);
        console.log(data.passwordfield2);
        if (data.passwordfield == data.passwordfield2){
            if (data.companies == 'other'){
            var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&day="+data.dobfield+"&sex="+data.genderfield+"&password="+data.passwordfield+"&refcode="+data.refcodefield+"&officename="+data.officename+"&officeaddress="+data.officeaddress+"&officelocation="+data.officelocation;
            }
            else{
            var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&day="+data.dobfield+"&sex="+data.genderfield+"&password="+data.passwordfield+"&refcode="+data.refcodefield+"&officeid="+data.companies;
            }
            
            $http({
                method : "POST",
                url: link+"register",
                data: registerdata,
                headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
               }).then(function(response) {
                console.log(response.data.result);
                    $scope.show = false;
                    if(response.data.result.error == false){
                        console.log("Registration Successful");
                        setTimeout(function(){
                        $window.location.href="#/login";
                        }, 10000);
                        $scope.show = true;
                    }
                    else{
                        console.log("Registration Failed");
                        $scope.error = response.data.result.errors[0];
                        $scope.show = true;
                    }
            },

            function(error) {
            console.log(error);
            });
            
        }
        else{
           $scope.error = 'Passwords do not match, please re-type password';
            $scope.show = true;     
        }
       
    };

  }]);









