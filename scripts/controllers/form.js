'use strict';

angular.module('zafiro.yuli')
.controller('formCtrl', function($scope, $location, $http, toasty, $rootScope) {

	$scope.row = {};
	$scope.userAlt = 'o';
	$scope.sinCorreo = false;
	$scope.adic = {};
	$scope.deps = [];

	$http.get('/deps')
	.success(function(data) {
		if(data) $scope.deps = data;
	});

	$scope.setSC = function(val) {
		$scope.sinCorreo = val;
	};

    $scope.save = function() {
    	if(!$scope.row.primary || !$scope.row.primary.mail) {
    		toasty.pop.error({
    			title: 'Error!',
    			msg: 'Debe al menos ingresar un correo electrónico, y asignarlo como primario.'
    		});
    		return;
    	}
    	$scope.row.mails.o = $scope.row.mails.o.filter(function(mail) {
    		return mail.mail;
    	}).map(function(mail) {
    		mail.primary = mail == $scope.row.primary; 
    		return mail;
    	});
    	$scope.row.mails.p = $scope.row.mails.p.filter(function(mail) {
    		return mail.mail;
    	}).map(function(mail) {
    		mail.primary = mail == $scope.row.primary;
    		return mail;
    	});
    	if($scope.row.type=='new'&&!$scope.row.cargado&&!$scope.row.mails.o.length&&!$scope.adic.dependencia) {
    		toasty.pop.error({
    			title: 'Error!',
    			msg: 'Debe completar los campos adicionales.'
    		});
    		$scope.setSC(true);
    		return;
    	}
    	if($scope.userAlt!='o') {
    		$scope.row.user = $scope.row.alts[$scope.userAlt];
    	} else {
    		$scope.row.user = $scope.oUser;
    	}
        //var data = $.extend({}, $scope.row, {user: $scope.user});
        $scope.row.adic = $scope.adic;
        $http.post('/person', $scope.row)
        .success(function(data, status, headers, config) {
          $scope.row.cargado = true;
          toasty.pop.success({
            title: 'Éxito!',
            msg: 'El usuario se guardó con éxito'
          });
          $location.path('/success');
        })
        .error(function(){
          toasty.pop.error({
            title: 'Error!',
            msg: 'No se pudo guardar el usuario. Por favor, vuelva a intentarlo.'
          });
          $scope.row.mails.p.push({});
		  $scope.row.mails.o.push({});
        });
      
    };

	$scope.add = function(type, last) {
		if(last) {
			$scope.row.mails[type].push({mail: '', verified: false, primary: false});
		}
	};

	/*$scope.focus = function() {
		$scope.userAlt='o';
	};*/

	$scope.buscarPersonas = function() {
		$http({method: 'GET', url: '/person'})
		.success(function(data, status, headers, config) {
			$scope.found = data.length;
			if(data) {
				$scope.row = data;
				$scope.loadedUser = $scope.row.user;
				$scope.oUser = typeof $scope.row.user=='string'?$scope.row.user.split('@')[0]:'';
				$scope.visible = true;
				$scope.row.mails.o.forEach(function(mail) {
					if(mail.primary) {
				  		$scope.row.primary = mail;
				  	}
				});
				$scope.row.mails.p.forEach(function(mail) {
				  	if(mail.primary) {
				  		$scope.row.primary = mail;
				  	}
				});
				if($scope.row.cargado) {
					/*toasty.pop.warning({
						title: 'Advertencia',
						msg: 'El usuario ya ha sido cargado. Sólo podrá agregar cuentas asociadas.'
					});*/
				}
				$scope.row.mails.p.push({});
				$scope.row.mails.o.push({});
			} else {
				toasty.pop.error({
					title: 'Error!',
					msg: 'Se ha detectado mas de un usuario utilizando el mismo identificador. Por favor, pongase en contacto con el administrador del sistema.'
				});
				$location.path('/');
			}
		})
		.error(function(data, status, headers, config) {
			toasty.pop.error({
				title: 'Error!',
				msg: data.error
			});
			$location.path('/');
		});
    };

    $scope.buscarPersonas();

	$scope.formFields = [
		{
			type: 'static',
			label: 'Nombre',
			key: 'givenName'
		},
		{
			type: 'static',
			label: 'Apellido',
			key: 'sn'
		},
		{
			type: 'static',
			label: 'CUIL',
			key: 'cuil'
		},
		{
			type: 'static',
			label: 'Documento',
			key: 'uidNumber'
		},
		{
			type: 'static',
			label: 'Correo Electrónico',
			key: 'mail'
		}
	];	
});
