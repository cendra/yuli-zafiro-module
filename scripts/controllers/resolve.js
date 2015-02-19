'use strict';

angular.module('migracionApp')
.controller('ResolveCtrl', function($scope, $location, $http, toasty) {

	$http.get('/resolve')
	.success(function(data) {
		if(data) $.extend($scope, data);
	})
	.error(function(data) {
		toasty.pop.error({
			title: 'Error!',
			msg: data.error
		});
		$location.path('/');
	});

	$scope.resolve = function() {
		$http.post('/resolve', {conf: $scope.selected.conf, que: $scope.selected.que})
		.success(function(data) {
			toasty.pop.success({
				title: 'Éxito!',
				msg: 'Ha resuelto el conflicto'
			});
			$location.path('/form');
		})
		.error(function(data) {
			toasty.pop.error({
				title: 'Error!',
				msg: data.error
			});
			$location.path('/');	
		})
	};
});