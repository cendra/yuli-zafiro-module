'use strict';

angular.module('migracionApp')
.controller('ReportCtrl', function($scope, $location, $http, $routeParams) {
	$scope.deps = [];

	$http.get('/deps')
	.success(function(data) {
		if(data) $scope.deps = data;
	});

	$scope.report = function() {
		var params = {
			tel: $scope.tel,
			dep: $scope.dependencia,
			legajo: $scope.legajo,
			uid: $routeParams.uid
		};
		$http.get('/report', {params: params})
		.success(function(data) {
			$location.path('/form');
		})
		.error(function(data) {
			$scope.error = true;
		});
	};
});