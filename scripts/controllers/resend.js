'use strict';

angular.module('migracionApp')
.controller('ResendCtrl', function($scope, $location, $http, $routeParams) {
	$scope.status = 'sending';
	$http.get('/resend', {params: $routeParams.uid})
	.success(function(data) {
		$scope.status= 'ok';
		$scope.mail = data.mail;
	})
	.error(function(data) {
		$scope.status= 'error';
		$scope.mail = data.mail;
	});

	
});