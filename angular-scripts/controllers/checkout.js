'use strict';

/**
 * @ngdoc function
 * @name mealimeterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealimeterApp
 */
angular.module('mealimeterApp')
.controller("paymentCtrl", ['$rootScope','$scope', '$sce', '$localStorage', '$window', '$http', function($rootScope,$scope, $sce, $localStorage, $window, $http){
	
	var pb = document.getElementById("payBtn");	
	pb.innerHTML = "Pay Now";
	
	var food="";
	var price="";
	var quantity="";
	var total = 0;
	var due = 0;
	var companysubsidy = 0;
	for(var i = 0;i<5;i++){
		if($localStorage.cart[i] == undefined){
			food += ";";
			price += ";";
			quantity += ";";
		}
		else{
			angular.forEach($localStorage.cart[i], function(foods){
				food += foods.mainmeal +" + "+foods.additive+ ",.,";
				price+= foods.price + ",.,";
				quantity+= foods.quantity + ",.,";
			});
			food += ";";
			price += ";";
			quantity += ";";
			// console.log($localStorage.due[i]);
			total += Number.parseInt($localStorage.total[i]);
			due += Number.parseInt($localStorage.due[i]);
			companysubsidy +=  Number.parseInt($scope.companysubsidy);
		}				
	}
	$scope.total = total;
	
	// console.log(due);
	// console.log(total);
	// console.log($scope.total);

	$scope.ngFn = function () {
	pb.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Loading...";
	console.log($localStorage.data);
		
		var handler = PaystackPop.setup({
            key: 'pk_test_1a3915a63f35d2e74b91f0f61f0b9679a12c7520',
            email: $localStorage.data.data.email,
            amount: due*100,
            ref: "MM_"+Math.floor(Math.random()*100000)+"_"+Math.floor(Math.random()*100000),
            metadata: {
                custom_fields: [{
                    username: $localStorage.data.data.username
                }]
            },
            callback: function(response) {
				console.log(response);
				pb.innerHTML = "Pay Now";				
                // alert('success. transaction ref is ' + response.reference);
				var data = "token="+$localStorage.data.data.token+"&total="+total+"&subsidy="+companysubsidy+"&paid="+due+"&food="+food+"&price="+price+"&quantity="+quantity;
				console.log(data);
				  var link = $rootScope.mealimeter;
			  	$http({
			  	    method : "POST",
			  	    url: link+"buycash",
			  	    data: data,
			  	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
			  	}).then(function(result) {
			  		delete $localStorage.due;
			  		delete $localStorage.total;
			  		delete $localStorage.cart;
			  		alert("Your order has been taken");
			  		$window.location.href = "#/pre-order/rating";
			  	}, function(error) {
			  	  console.log(error);
			  	});
            },
            onClose: function() {
				pb.innerHTML = "Pay Now";
				$scope.$broadcast('changetitle-back');
                alert('No transaction was carried out');
            }
        });
        handler.openIframe();
    };
}])
  .controller('CheckoutCtrl',['$scope','$http','$rootScope','$window','$localStorage','$location',function ($scope,$http,$rootScope, $window, $localStorage,$location) {
	  if($localStorage.data == undefined){
  		$window.location.href = "#/login";
  	}
  	else{
	    $scope.redirect = function(day){
	  		$window.location.href = "#/pre-order/"+day;
		};
		$scope.companysubsidy = $localStorage.data.officedata.office_payment_amount;
		if($localStorage.cart[0] != undefined || $localStorage.cart[0] != null){
			$scope.monday = $localStorage.cart[0];
			$scope.mondaytotal = $localStorage.total[0];
			$scope.mondaydue = $localStorage.due[0];
		}
		else{
			$scope.monday = [];
			$scope.mondaytotal = 0;
			$scope.mondaydue = 0;
		}
		if($localStorage.cart[1] != undefined || $localStorage.cart[1] != null){
			$scope.tuesday = $localStorage.cart[1];
			$scope.tuesdaytotal = $localStorage.total[1];
			$scope.tuesdaydue = $localStorage.due[1];
		}
		else{
			$scope.tuesday = [];
			$scope.tuesdaytotal = 0;
			$scope.tuesdaydue= 0;
		}

		if($localStorage.cart[2] != undefined || $localStorage.cart[2] != null){
			$scope.wednesday = $localStorage.cart[2];
			$scope.wednesdaytotal = $localStorage.total[2];
			$scope.wednesdaydue = $localStorage.due[2];
		}
		else{
			$scope.wednesday = [];
			$scope.wednesdaytotal = 0;
			$scope.wednesdaydue = 0;
		}

		if($localStorage.cart[3] != undefined || $localStorage.cart[3] != null){
			$scope.thursday = $localStorage.cart[3];
			$scope.thrusdaytotal = $localStorage.total[3];
			$scope.thursdaydue = $localStorage.due[3];
		}
		else{
			$scope.thursday = [];
			$scope.thursdaytotal = 0;
			$scope.thursdaydue= 0;
		}

		if($localStorage.cart[4] != undefined || $localStorage.cart[4] != null){
			$scope.friday = $localStorage.cart[4];
			$scope.fridaytotal = $localStorage.total[4];
			$scope.fridaydue = $localStorage.due[4];
		}
		else{
			$scope.friday = [];
			$scope.fridaytotal = 0;
			$scope.fridaydue = 0;
		}

		$scope.docheckout = function(){
			var food="";
			var price="";
			var quantity="";
			var total = 0;
			var due = 0;
			var companysubsidy = 0;
			for(var i = 0;i<5;i++){
				if($localStorage.cart[i] == undefined){
					food += ";";
					price += ";";
					quantity += ";";
				}
				else{
					angular.forEach($localStorage.cart[i], function(foods){
						food += foods.mainmeal +" + "+foods.additive+ ",.,";
					  	price+= foods.price + ",.,";
					  	quantity+= foods.quantity + ",.,";
					});
					food += ";";
					price += ";";
					quantity += ";";
					// console.log($localStorage.due[i]);
					total += Number.parseInt($localStorage.total[i]);
					due += Number.parseInt($localStorage.due[i]);
					companysubsidy +=  Number.parseInt($scope.companysubsidy);
				}
				
			}
			// console.log(due);
			// console.log(total);
			// console.log(price);
		  	var data = "token="+$localStorage.data.data.token;
			var link = $rootScope.mealimeter;
			$http({
			    method : "POST",
			    url: link+"getBalance",
			    data: data,
			    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
			}).then(function(result) {
			  $scope.balance = result.data.balance;
			  if(Number.parseInt($scope.balance) > due){
			  	var data = "token="+$localStorage.data.data.token+"&total="+total+"&subsidy="+companysubsidy+"&paid="+due+"&food="+food+"&price="+price+"&quantity="+quantity;
			  	var link = $rootScope.mealimeter;
			  	$http({
			  	    method : "POST",
			  	    url: link+"buywallet",
			  	    data: data,
			  	    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'} 
			  	}).then(function(result) {
			  		delete $localStorage.due;
			  		delete $localStorage.total;
			  		delete $localStorage.cart;
			  		alert("Your order has been taken");
			  		$window.location.href = "#/pre-order/monday";
			  	}, function(error) {
			  	  console.log(error);
			  	});
			  }
			  else{
			  	alert("Your wallet balance isn't sufficient.Please Top Up");
			  }
			}, function(error) {
			  console.log(error);
			});
			
			
			
			// console.log(food);
			// console.log(price);
			// console.log(quantity);
			// console.log(total);
			// console.log(due);
			// console.log(companysubsidy);
		}
	}
  }]);
