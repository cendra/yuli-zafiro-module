'use strict';

angular.module('zafiro')
.controller('loginCtrl', function($scope, zafiro) {
	$scope.formFields = [
		{
			key: 'username',
			type: 'md-input',
			templateOptions: {
				type: 'text',
				label: 'User Name',
				placeholder: 'User Name'
			}
		},
		{
			key: 'password',
			type: 'md-input',
			templateOptions: {
				type: 'password',
				label: 'Password',
				placeholder: 'Password'
			}
		}
	];
	$scope.submit = function() {
		zafiro.login({
			user: $scope.username, 
			password: $scope.password
		}, function(data) {
			alert('ok');
		}, function(data) {
			alert('error');
		});
	};
});