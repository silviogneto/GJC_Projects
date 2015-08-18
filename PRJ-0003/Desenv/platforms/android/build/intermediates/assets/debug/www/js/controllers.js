angular.module('traceFood.controllers', ['chart.js', 'traceFood.services'])

.controller('EstatisticaCtrl', function($scope, $ionicPlatform, $cordovaSQLite) {
  // historico do peso
  // {
    $scope.chartPeso = {};

    function udpateGraficos() {
      (function() {
        var query = "SELECT peso, strftime('%d/%m/%Y', date) as data FROM HistoricoPeso";

        $cordovaSQLite.execute(db, query).then(function(res) {
          if (res.rows.length > 0) {
            $scope.chartPeso.data = [[]];
            $scope.chartPeso.labels = [];
            $scope.chartPeso.series = ['Pesos'];

            for (var i = 0; i < res.rows.length; i++) {
              var row = res.rows.item(i);

              $scope.chartPeso.data[0].push(row.peso);
              $scope.chartPeso.labels.push(row.data);
            }
          }
        }, function (err) {
          console.error(err);
        });
      })();
    };

    $ionicPlatform.ready(function() {
      udpateGraficos();
    });


    $scope.carregaGraficoPeso = udpateGraficos;
  // }

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('RefeicoesCtrl', function($scope) {
  /*$scope.refeicoes = [
    { id: 1, data: '06/07/2015' },
    { id: 2, data: '07/07/2015' },
    { id: 3, data: '08/07/2015' },
    { id: 4, data: '09/07/2015' },
  ];

  $scope.add = function() {

  };

  $scope.del = function(id) {

  };*/
})

.controller('RefeicaoCtrl', function($scope) {
})

/*.controller('AlimentoCtrl', function($scope, AlimentoService) {
})*/

.controller('AlimentosCtrl', function($scope, $ionicPopover, $ionicModal, $ionicListDelegate, AlimentoService) {
  $scope.alimentoTipos = [
    { key: 1, value: 'Cereal'},
    { key: 2, value: 'Carne'},
    { key: 3, value: 'Fruta'},
    { key: 4, value: 'Hortaliça'},
    { key: 5, value: 'Laticínio'},
    { key: 6, value: 'Legume'},
    { key: 7, value: 'Massa'},
    { key: 8, value: 'Pão'},
    { key: 9, value: 'Vegetal'}
  ];
  $scope.alimentos = [];

  function select() {
    AlimentoService.getAll().then(
      function(alimentos) {
        $scope.alimentos = alimentos;
      },
      function(failure) {
        alert(failure);
        console.error(failure);
      }
    );
  };
  select();

  var template = ['<ion-popover-view>',
                    '<ion-header-bar><h1 class="title">Opções</h1></ion-header-bar>',
                    '<ion-content>',
                      '<div class="list">',
                        '<div class="item" ng-click="add();">Novo</div>',
                        '<a class="item" href="#/app/estatistica">Estatísticas</a>',
                      '</div>',
                    '</ion-content>',
                  '</ion-popover-view>'].join('');

                  //<button class="button button-clear" ng-click="add()">Novo</button>
  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/alimento.html', {scope: $scope}).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.alimento = {};
  });

  // modal methods
  function getAlimento() {
    if ($scope.modal.alimento != undefined) {
      AlimentoService.getByModel($scope.modal.alimento).then(
        function(alimento) {
          if (alimento != undefined) {
            parseAlimento(alimento); 
          }
        },
        function(failure) {
          console.error(failure);
        }
      );
    /*} else {
      AlimentoService.getEmptyModel().then(
        function(alimento) {
          parseAlimento(alimento);
        },
        function(failure) {
          console.error(failure);
        }
      );*/
    }
  };

  function parseAlimento(a) {
    $scope.modal.alimento.id = a.id;
    $scope.modal.alimento.descricao = a.descricao;
    $scope.modal.alimento.valorEnergetico = a.valorEnergetico;
    $scope.modal.alimento.tipo = a.tipo;
    $scope.modal.alimento.carboidratos = a.carboidratos;
    $scope.modal.alimento.proteinas = a.proteinas;
    $scope.modal.alimento.gordurasTotais = a.gordurasTotais;
    $scope.modal.alimento.gordurasTrans = a.gordurasTrans;
    $scope.modal.alimento.calcio = a.calcio;
    $scope.modal.alimento.ferro = a.ferro;
    $scope.modal.alimento.sodio = a.sodio;
    $scope.modal.alimento.vitaminaA = a.vitaminaA;
    $scope.modal.alimento.vitaminaC = a.vitaminaC;
    $scope.modal.alimento.vitaminaD = a.vitaminaD;
    $scope.modal.alimento.vitaminaE = a.vitaminaE;
    $scope.modal.alimento.fibraAlimentar = a.fibraAlimentar;
    $scope.modal.alimento.colesterol = a.colesterol;
    $scope.modal.alimento.potassio = a.potassio;
  };

  // methods
  $scope.add = function() {
    $ionicListDelegate.closeOptionButtons();
    $scope.closePopover();

    $scope.modal.alimento = undefined;

    getAlimento();

    $scope.modal.show();
  };

  $scope.edit = function(alimento) {
    $ionicListDelegate.closeOptionButtons();
    $scope.closePopover();

    $scope.modal.alimento = alimento;

    getAlimento();

    $scope.modal.show();
  };

  $scope.del = function(alimento) {
    $ionicListDelegate.closeOptionButtons();

    AlimentoService.deleteAlimento(alimento).then(
      function(deleted) {
        var index = $scope.alimentos.indexOf(alimento);
        $scope.alimentos.splice(index, 1);
      },
      function(failure) {
        console.error(err);
      }
    );
  };

  $scope.addAlimento = function(form, alimento) {
    if (form == undefined) {
      return;
    }

    if (form.$invalid) {
      alert('Campos obrigatórios não preenchidos!');
      return;
    }

    AlimentoService.saveAlimento(alimento).then(
      function(saved) {
        $scope.modal.reload = true;

        $scope.closeModal();
      },
      function(failure) {
        alert('Erro: ' + failure);
        console.error(failure);
      }
    );
  };

  $scope.closeModal = function() {
    if ($scope.modal.reload == true) {
      $scope.modal.reload = undefined;
      select();
    }

    $scope.modal.hide();
  };

  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.popover.remove();
    $scope.modal.remove();
  });
})

.controller('PesoCtrl', function($scope, $ionicModal, $ionicListDelegate, PesoService) {
  $scope.p = {
    novoPeso: undefined
  };

  $scope.pesos = [];

  function selectPesos() {
    PesoService.getAll().then(
      function(pesos) {
        $scope.pesos = pesos;
      },
      function(failure) {
        console.error(failure);
      }
    );
  };

  selectPesos();

  $scope.add = function(p) {
    PesoService.savePeso(p).then(
      function(saved) {
        $scope.p.novoPeso = undefined;
        selectPesos();
      },
      function(failure) {
        console.error(failure);
      }
    );
  };

  $scope.del = function(peso) {
    $ionicListDelegate.closeOptionButtons();

    PesoService.deletePeso(peso).then(
      function(deleted) {
        var index = $scope.pesos.indexOf(peso);
        $scope.pesos.splice(index, 1);
      },
      function(failure) {
        console.error(err);
      }
    );
  };

  $ionicModal.fromTemplateUrl('templates/pesoIMC.html', {scope: $scope}).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.imc = function(peso) {
    $ionicListDelegate.closeOptionButtons();

    $scope.modal.peso = peso;
    $scope.modal.altura = undefined;
    $scope.modal.show();
  };

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('PesoIMCCtrl', function($scope) {

});
