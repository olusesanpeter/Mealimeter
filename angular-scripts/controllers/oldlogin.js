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
    if($localStorage.data != undefined){
        $window.location.href = "#/pre-order/monday";
    }
    else{
        $scope.logins = function(data){
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
                        $window.location.href="#/pre-order/monday";
                    }
                }
                else{
                    if(response.data.description == "Not Activated"){
                        $scope.error = 'Not Activated Your Account.Please check your email';
                        
                    }
                    else{
                        $scope.error = 'Incorrect Credentials. Please try again';
                    }
                }
            }, function(error) {
              console.log(error);
            });
        };
    }
    

  }]);
