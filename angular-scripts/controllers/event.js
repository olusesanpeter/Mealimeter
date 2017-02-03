'use strict';


angular.module('mealimeterApp')
    .controller('EventCtrl', ['$scope', '$http', '$rootScope', '$window', '$localStorage', '$location', '$routeParams', function($scope, $http, $rootScope, $window, $localStorage, $location, $routeParams) {

        if ($routeParams.tag) {
            $scope.eventTag = $routeParams.tag;
        } else {
            swal({
                    title: "This link is invalid!",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    closeOnConfirm: true,
                    closeOnCancel: false
                },
                function(isConfirm) {
                    $window.location.href = "#/pre-order";
                });
        }

        $scope.foodlist = [];
        $scope.fSelect = [];
        $scope.food_id = null;

        var link = $rootScope.mealimeter;
        $http({
            method: "POST",
            url: link + "order/getEventOrder?tag=" + $scope.eventTag,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
        }).then(function(result) {
            console.log(result.data);
            if (result.data.result != false) {
                $scope.foodlist = result.data.result;

                var createdate = result.data.result.created_at;
                createdate = moment(createdate, 'YYYY-MM-DD hh:mm:ss');

                var timediff = createdate.diff(moment(), 'hours');
                console.log(timediff);

                if (timediff > 24) {
                    swal({
                            title: "This link is expired!",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            closeOnConfirm: true,
                            closeOnCancel: false
                        },
                        function(isConfirm) {
                            $window.location.href = "#/pre-order";
                        });

                }

                console.log($scope.foodlist);
                var fls = $scope.foodlist.foods;

                fls.forEach(function(fl) {
                    $scope.fSelect[fl.id] = 0;
                }, this);
            } else {
                swal({
                        title: "This link is invalid!",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        closeOnConfirm: true,
                        closeOnCancel: false
                    },
                    function(isConfirm) {
                        $window.location.href = "#/pre-order";
                    });
            }
        }, function(error) {
            console.log(error);
        });

        $scope.foodNum = function(num) {
            var numarray = [];
            for (var i = 1; i <= num; i++) {
                numarray.push(i);
            }

            return numarray;
        }

        $scope.selectFood = function(fid) {
            $scope.food_id = fid;
        }

        $scope.goto = function(page) {
            $("#myModal").modal('hide');
            $('#myModal').on('hidden.bs.modal', function(e) {
                $window.location.href = "#/" + page;
            });
        }

        $scope.confirmSelection = function() {
            console.log($scope.food_id);
            if ($localStorage.guest == true) {
                $("#myModal").modal();
            } else {
                if ($scope.food_id == null) {
                    swal({
                        title: "Please make a selection",
                        html: true
                    });
                    return
                }
                $("#confirmBtn").text("Loading...");
                $("#confirmBtn").prop("disabled", true);
                $scope.sendSelection();
            }

        }

        $scope.sendSelection = function() {
            var senddata = {
                token: $localStorage.data.data.token,
                food_id: $scope.food_id,
                tag: $scope.eventTag,
            }
            console.log(senddata);
            senddata = $scope.formData(senddata);
            var link = $rootScope.mealimeter;
            $http({
                method: "POST",
                url: link + "makebirthdayselection",
                data: senddata,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
            }).then(function(response) {
                    $("#confirmBtn").prop("disabled", false);
                    $("#confirmBtn").text("Confirm Selection");
                    if (response['error'] == true) {
                        toastr.warning("Something went wrong: " + response['description']);
                    } else {
                        swal({
                                title: "Great!",
                                text: "Your selection has been noted!",
                                showCancelButton: false,
                                confirmButtonText: "Ok",
                                closeOnConfirm: true,
                                closeOnCancel: false
                            },
                            function(isConfirm) {
                                $window.location.href = "#/pre-order";
                            });
                    }
                },
                function(error) {
                    $("#confirmBtn").text("Confirm Selection");
                    $("#confirmBtn").prop("disabled", false);

                    console.log(error);
                    toastr.warning("Something went wrong. Check internet connection ");
                });
        }

        $scope.formData = function(myFormData) {
            return Object.keys(myFormData).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
            }).join('&');
        }


    }]);