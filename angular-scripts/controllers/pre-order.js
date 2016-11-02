'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:preorderctrl
 * @description
 * # preorderctrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
  .controller('preorderCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
  	if($localStorage.data == undefined){
  		$window.location.href = "#/login";
  	}
  	else{
  		if($location.path().split('/')[2] == "monday"){
  			$scope.day= 0;
  			$scope.daytext= "Monday";
  		}
  		else if($location.path().split('/')[2] == "tuesday"){
  			$scope.day= 1;
  			$scope.daytext= "Tuesday";
  		}
  		else if($location.path().split('/')[2] == "wednesday"){
  			$scope.day= 2;
  			$scope.daytext= "Wednesday";
  		}
  		else if($location.path().split('/')[2] == "thursday"){
  			$scope.day= 3;
  			$scope.daytext= "Thursday";
  		}
  		else if($location.path().split('/')[2] == "friday"){
  			$scope.day= 4;
  			$scope.daytext= "Friday";
  		}
  		else{
  			$window.location.href = "#/pre-order/monday";
  		}
	  	var data = "token="+$localStorage.data.data.token;
	  	$scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
		var link = $rootScope.mealimeter;
		// console.log($localStorage.data);
		$scope.username =  $localStorage.data.data.username;
		$scope.drinks = [];
		$scope.snacks = [];
		$scope.food = [];
		$scope.done = true;
		$scope.notdone = false;
		$http({
		    method : "POST",
		    url: link+"getmealspreorder",
		    data: data,
		    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
		}).then(function(result) {
			// console.log(result.data);
			if(result.data.description == "Already Preordered"){
				$scope.done = false;
				$scope.notdone = true;
			}
			else{
				$scope.snacks = result.data.snacks;
				$scope.drinks = result.data.drinks;
				$scope.meals = result.data.preorderList;
				$scope.done = true;
				$scope.notdone = false;
				
				// console.log($scope.meals);
			}
		  
		  // console.log($scope.drinks);
		  // console.log($scope.snacks);

		}, function(error) {
		  console.log(error);
		});

		
		if($localStorage.cart == undefined){
			// alert("empty");
			$localStorage.cart = [];
			$localStorage.total = [];
			$localStorage.due = [];
			$scope.cart = [];
			$scope.total = 0;
			$scope.due = 0;
			$scope.one = "none";
			$scope.two = "block";
		}
		else{
			if($localStorage.cart[$scope.day] == undefined){
				$localStorage.cart[$scope.day] = [];
				$localStorage.total[$scope.day] = 0;
				$localStorage.due[$scope.day] = 0;
				$scope.cart = [];
				$scope.total = 0;
				$scope.due = 0;
				$scope.one = "none";
				$scope.two = "block";
			}
			else{
			// 	console.log($scope.day);
			// 	console.log($localStorage.cart);
			// 	console.log($localStorage.total);
				$scope.cart = $localStorage.cart[$scope.day];
				$scope.total = $localStorage.total[$scope.day];
				$scope.due = $localStorage.due[$scope.day];
				$scope.one = "block";
				$scope.two = "none";
			}
		}
		$scope.addtocart = function(id,len){
			var main = $scope.meals[$scope.day].options[len].option.name;
			var additive = $scope.meals[$scope.day].options[len].option.additives[id];
			var price = $scope.meals[$scope.day].options[len].option.prices[id];
			if(len == 0){
				var newid = (len + 1)*(id + 1);
			}
			else{
				var prevsize = 0;
				for(var i = 0;i<len;i++){
					prevsize += $scope.meals[$scope.day].options[i].option.additives.length;
				}
				var newid = prevsize + (id+1);
			}
			var t = false;
			var currentposition = 0;
			var total = 0;
			for (var i = 0; i < $scope.cart.length; i++) {
				if(newid == $scope.cart[i].id){
					t = true;
					currentposition = i;
				}
				total += Number.parseInt($scope.cart[i].price);
			}
			if(t == false){
				$scope.cart.push({'id':newid,'mainmeal':main,'additive':additive,'price':price,'quantity':1});
				total += Number.parseInt(price);
			}
			else{
				var oldquantity = $scope.cart[currentposition].quantity;
				var newquantity = oldquantity+1;
				var oldprice = $scope.cart[currentposition].price;
				var newprice = ((oldprice)/oldquantity) * newquantity;
				total = total - oldprice + newprice;
				$scope.cart[currentposition] = {'id':newid,'mainmeal':main,'additive':additive,'price':newprice,'quantity':newquantity};
			}
			$scope.total = total;
			$scope.due = $scope.total - $scope.companysubsidy;
			$localStorage.cart[$scope.day] = $scope.cart;
			$localStorage.total[$scope.day] = $scope.total;
			$localStorage.due[$scope.day] = $scope.due;
			$scope.empty = false;
			$scope.one = "block";
			$scope.two = "none";
		}

		$scope.remove = function(id,len){
			var main = $scope.meals[$scope.day].options[len].option.name;
			var additive = $scope.meals[$scope.day].options[len].option.additives[id];
			var price = $scope.meals[$scope.day].options[len].option.prices[id];
			if(len == 0){
				var newid = (len + 1)*(id + 1);
			}
			else{
				var prevsize = 0;
				for(var i = 0;i<len;i++){
					prevsize += $scope.meals[$scope.day].options[i].option.additives.length;
				}
				var newid = prevsize + (id+1);
			}
			var t = false;
			var currentposition = 0;
			var total = 0;
			for (var i = 0; i < $scope.cart.length; i++) {
				if(newid == $scope.cart[i].id){
					t = true;
					currentposition = i;
				}
				total += Number.parseInt($scope.cart[i].price);
			}
			if(t == true){
				var oldquantity = $scope.cart[currentposition].quantity;
				if(oldquantity > 1){
					var newquantity = oldquantity-1;
					var oldprice = $scope.cart[currentposition].price;
					var newprice = ((oldprice)/oldquantity) * newquantity;
					total = total - oldprice + newprice;
					$scope.cart[currentposition] = {'id':newid,'mainmeal':main,'additive':additive,'price':newprice,'quantity':newquantity};
				}
				else{
					var newquantity = oldquantity-1;
					var oldprice = $scope.cart[currentposition].price;
					total = total - oldprice;
					$scope.cart.splice(currentposition,1);
				}
			}
			
			$scope.total = total;
			$scope.due = $scope.total - $scope.companysubsidy;
			$localStorage.cart[$scope.day] = $scope.cart;
			$localStorage.total[$scope.day] = $scope.total;
			$localStorage.due[$scope.day] = $scope.due;
			$scope.empty = false;
			$scope.one = "block";
			$scope.two = "none";
		}
  	}

  }]);
