'use strict';

/**
 * @ngdoc overview
 * @name migracionApp
 * @description
 * # migracionApp
 *
 * Main module of the application.
 */
angular
  .module('migracionApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'toasty',
    'mgo-angular-wizard',
    'formly'
  ])
  .config(function($routeProvider, $locationProvider, formlyTemplateProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'views/wizard.html',
    controller: 'wizCtrl'
  })
  .when('/form', {
    templateUrl: 'views/form.html',
    controller: 'formCtrl'
  })
  .when('/comdoc', {
    template: '<div class="alert alert-info"><p>A continuación se le pedirá que ingrese su nombre de <strong>usuario y contraseña de <em>Comdoc</em></strong>. Si usted está acostumbrado a ingresar en <em>Comdoc</em>, cuando ingrese el usuario, deberá hacerlo <strong>sin "@unc"</strong>.</p><p>Luego, le informará que <strong>la aplicación solicita</strong> ciertos datos de su cuenta. Por favor, <strong>acepte</strong> la solicitud para poder ingresar al formulario.</p></div><p>Haga click en el siguiente enlace para comenzar su autenticación en usuarios.</p><p><a class="btn btn-default" href="/connect">Autenticar</a></p>'
  })
  .when('/usuario', {
    template: '<p>Por favor, realice el procedimiento de recuperación de contraseña, luego podrá ingresar por la primera opicón. Si no pudo recuperar su contraseña, siga por la tercera opción.</p><div class="alert alert-info">Sería conveniente <strong>revisar</strong>, <em>(y <strong>modificar</strong> de ser necesario)</em>, como aparecen sus <strong>datos</strong> dentro del sistema de usuarios, ya que su nombre y apellido determina el <strong>nombre de usuario</strong> válido que puede <em>reservar</em>.</div> <p><a class="btn btn-default" href="http://usuarios.unc.edu.ar">Recuperar Contraseña</a></p>'
  })
  .when('/manual', {
    templateUrl: 'views/manual.html',
    controller: 'manCtrl'
  })
  .when('/success', {
    templateUrl: 'views/success.html'
  })
  .when('/tokenError', {
    templateUrl: 'views/tokenError.html'
  })
  .when('/emailSuccess', {
    templateUrl: 'views/emailSuccess.html'
  })
  .when('/resend/:uid', {
    templateUrl: 'views/resend.html',
    controller: 'ResendCtrl'
  })
  .when('/report/:uid', {
    templateUrl: 'views/report.html',
    controller: 'ReportCtrl'
  })
  .when('/resolve', {
    templateUrl: 'views/resolve.html',
    controller: 'ResolveCtrl'
  })
  .otherwise('/');
  //$locationProvider.html5Mode(true);
  formlyTemplateProvider.setTemplateUrl('static', 'views/formly-static.html');
})
  .directive('uncUser', ['$http', 'toasty', '$parse', function($http, toasty, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            var getter = $parse(attrs.ngModel);
            var setter = getter.assign;

            var verifying = false;

            var verify = function() {
              /*if(scope.row.cargado) {
                modelCtrl.$setValidity('uncUser', true);
                return;
              }*/
              if(verifying) {
                clearTimeout(verifying);
              }
              verifying=setTimeout(function() {

                var config = {
                  params: {
                    id: scope.row.id,
                    nombre: scope.row.givenName,
                    apellido: scope.row.sn,
                    usuario: element.val()
                  }
                };
                $http
                  .get('/user/check', config)
                  .success(function(data, status, headers, config) {
                    modelCtrl.$setValidity('uncUser', data.valid);
                    if(!data.valid) {
                      setter(scope, element.val());
                      var msg;
                      switch(data.error) {
                        case 'verif':
                          msg = 'No se pudo verificar el nombre de usuario. Por favor, vuelva a intentarlo mas tarde.';
                          break;
                        case 'usuario':
                          msg = 'El nombre de usuario no es válido.';
                          break;
                        case 'usado':
                          msg = 'El nombre de usuario ya esta reservado. Por favor, elija uno nuevo.';
                      }
                      if(msg) {
                        toasty.pop.error({
                          title: 'Error!',
                          msg: msg
                        });
                      }
                    } else {
                      setter(scope, data.usuario);
                      if(!data.msg || data.msg != 'suyo') {
                        toasty.pop.success({
                          title: 'Éxito!',
                          msg: 'El nombre de usuario es correcto, y no está asignado a otro usuario.'
                        });
                      }
                    }

                  })
                  .error(function(data, status, headers, config) {
                    modelCtrl.$setValidity('uncUser', false);
                    toasty.pop.error({
                      title: 'Error!',
                      msg: 'No se pudo verificar el nombre de usuario. Por favor, vuelva a intentarlo mas tarde.'
                    });
                  });
              }, 500);
            };

            scope.$watch('row.givenName', function(){
              verify();
            });

            scope.$watch('row.sn', function(){
              verify();
            });

            modelCtrl.$parsers.unshift(function(value) {
              verify();
            });
        }
    };
  }
])
.directive('uncMail', ['$http', 'toasty', '$parse', function($http, toasty, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            var verifying = false;
            var getter = $parse(attrs.ngModel);
            var setter = getter.assign;

            var verify = function(value) {
              if(element.is(':disabled')) {
                modelCtrl.$setValidity('uncMail', true);
                return;
              }
              if(!new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").test(value)) {
                modelCtrl.$setValidity('uncMail', false);
                return;
              }
              if(verifying) {
                clearTimeout(verifying);
              }
              verifying=setTimeout(function() {

                var config = {
                  params: {
                    correo: value,
                    cuip: scope.row.cuil
                  }
                };
                $http
                  .get('/mail/check', config)
                  .success(function(data, status, headers, config) {
                    modelCtrl.$setValidity('uncMail', data.valid);
                    if(!data.valid) {
                      var msg;
                      switch(data.error) {
                        case 'verif':
                          msg = 'No se pudo verificar el correo. Por favor, vuelva a intentarlo mas tarde.';
                          break;
                        case 'correo':
                          msg = 'No se ha encontrado el correo en nuestros registros. Por favor, verifique que sea correcto.';
                          break;
                        case 'usado':
                          msg = 'El correo ya esta registrado por otro usuario. Si es un error, por favor pongase en contacto con su administrador de dominio.';
                      }
                      if(msg) {
                        toasty.pop.error({
                          title: 'Error!',
                          msg: msg
                        });
                      }
                    } else {
                      setter(scope, value);
                      toasty.pop.success({
                        title: 'Éxito!',
                        msg: 'El correo ingresado existe en nuestros registros, y no fue registrado por otro usuario.'
                      });
                    }

                  })
                  .error(function(data, status, headers, config) {
                    modelCtrl.$setValidity('uncMail', false);
                    toasty.pop.error({
                      title: 'Error!',
                      msg: 'No se pudo verificar el correo. Por favor, vuelva a intentarlo mas tarde.'
                    });
                  });
              }, 1000);
            };

            modelCtrl.$parsers.unshift(function(value) {
              verify(value);
            });
        }
    };
  }
]);
