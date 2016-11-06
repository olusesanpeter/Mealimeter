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
        var date = new Date(data.dobfield);
        data.datefield = date.getDate()+"/"+date.getMonth();
        console.log(data.datefield);
        if (data.companies == 'other'){
            var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&dob="+data.datefield+"&sex="+data.genderfield+"&password="+data.passwordfield+"&password="+data.passwordfield2+"&refcode="+data.refcodefield+"&officename="+data.officename+"&officeaddress="+data.officeaddress+"&officelocation="+data.officelocation;
            }
            else{
            var registerdata = "firstname="+data.firstnamefield+"&lastname="+data.lastnamefield+"&email="+data.emailfield+"&phoneNo="+data.phoneNofield+"&dob="+data.datefield+"&sex="+data.genderfield+"&password="+data.passwordfield+"&password="+data.passwordfield2+"&refcode="+data.refcodefield+"&officeid="+data.companies;
            }
        
        if (data.passwordfield != data.passwordfield2) {
                console.log("Registration Failed");
            $scope.error = "Passwords do not match, please try again"
            $scope.show = true;
        } else {
            $http({
            method : "POST",
            url: link+"register",
            data: registerdata,
            headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
           }).then(function(response) {
            console.log(response.data);
            $scope.show = false;
                if(response.data.result.error == false){
                    console.log("Registration Successful");
                    setTimeout(function(){
                    $window.location.href="#/registration-successful";
                    }, 100);
                    $scope.show = false;
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

        
    };

  }]);









