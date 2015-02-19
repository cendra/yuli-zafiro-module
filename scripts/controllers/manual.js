'use strict';

angular.module('migracionApp')
.controller('manCtrl', function($scope, $location, $http) {
	$scope.clean = function() {
		$scope.error = false;
	};

	$scope.search = function() {
		$http.get('/isNew?uid='+$scope.uid)
		.success(function(data) {
			if(!data.error) {
				$location.path('/form');
			} else {
				$scope.error = true;
			}
		})
		.error(function(data) {
			$scope.error = true;
		});
	};

	$scope.resend = function() {
		$location.url('/resend'+($scope.uid?'/'+$scope.uid:''));
	};

	$scope.report = function() {
		$location.url('/report'+($scope.uid?'/'+$scope.uid:''));
	};

	$scope.clean();
});