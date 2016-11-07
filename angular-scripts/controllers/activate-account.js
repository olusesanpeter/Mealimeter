'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('actCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  		if($location.path().split('/')[2].length == 32){
  			var link = $rootScope.mealimeter;
  			var hash = $location.path().split('/')[2];
  			$http({
			    method : "POST",
			    url: link+"activateaccount",
			    data: "hash="+hash,
			    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
			}).then(function(result) {
				console.log(result);
				if(result.data.description == "done"){
					$scope.successful = true;
				}
				else{
					$scope.successful = false;
				}
			}, function(error) {
			  console.log(error);
			});
  		}
  		else{
  			$scope.successful = false;
  		}

  }]);
