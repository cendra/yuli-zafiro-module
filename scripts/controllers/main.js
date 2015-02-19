'use strict';


/**
 * @ngdoc function
 * @name migracionApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the migracionApp
 */
angular.module('zafiro')
  .controller('wizCtrl', function ($scope, $http, toasty, $location, $rootScope) {

    $scope.reset = function() {
  		$scope.found = null;
      $scope.row = {};
      $scope.visible = false;
      //$scope.step1Status = 'comdoc';
    };

    $scope.next = function(step) {
      $rootScope.errorMsg = false;
      $location.path($location.path()+$scope.step1Status);
    };

    $scope.addMail = function() {
        $scope.row && $scope.row.mails && $scope.row.mails.push({mail:'', verified: false});
    };

    $scope.remMail = function(mail) {
        var o;
        if($scope.row && $scope.row.mails && (o = $scope.row.mails.indexOf(mail)) !== -1) {
            $scope.row.mails.splice(o, 1);
        }
    };


    $scope.reset();
  });
