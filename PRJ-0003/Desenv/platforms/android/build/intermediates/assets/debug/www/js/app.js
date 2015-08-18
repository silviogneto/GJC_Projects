// Ionic Starter App

var db = null,
    queryCreateBase = ['CREATE TABLE IF NOT EXISTS HistoricoPeso (id INTEGER PRIMARY KEY AUTOINCREMENT, peso REAL NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
                       ,'CREATE TABLE IF NOT EXISTS Alimento (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT NOT NULL, valorEnergetico INTEGER NOT NULL, tipo INTEGER NOT NULL, ' +
                                                          ' carboidratos INTEGER DEFAULT 0, proteinas INTEGER DEFAULT 0, ' +
                                                          ' gordurasTotais INTEGER DEFAULT 0, gordurasTrans INTEGER DEFAULT 0, ' +
                                                          ' calcio INTEGER DEFAULT 0, ferro INTEGER DEFAULT 0, sodio INTEGER DEFAULT 0, ' +
                                                          ' vitaminaA INTEGER DEFAULT 0, vitaminaC INTEGER DEFAULT 0, vitaminaD INTEGER DEFAULT 0, vitaminaE INTEGER DEFAULT 0, ' +
                                                          ' fibraAlimentar INTEGER DEFAULT 0, colesterol INTEGER DEFAULT 0, potassio INTEGER DEFAULT 0)'];

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('traceFood', ['ionic', 'ngCordova', 'chart.js', 'traceFood.controllers'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB("TFBase");
    angular.forEach(queryCreateBase, function(query) {
      $cordovaSQLite.execute(db, query);
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.refeicoes', {
    url: "/refeicao",
    views: {
      'content': {
        templateUrl: "templates/refeicoes.html",
        controller: 'RefeicoesCtrl'
      }
    }
  })

  .state('app.refeicao', {
    url: "/refeicao/:id",
    views: {
      'content': {
        templateUrl: "templates/refeicao.html",
        controller: 'RefeicaoCtrl'
      }
    }
  })

  .state('app.pratos', {
    url: "/prato",
    views: {
      'content': {
        templateUrl: "templates/pratos.html"
      }
    }
  })

  .state('app.prato', {
    url: "/prato/:id",
    views: {
      'content': {
        templateUrl: "templates/prato.html"
      }
    }
  })

  .state('app.alimentos', {
    url: "/alimento",
    views: {
      'content': {
        templateUrl: "templates/alimentos.html",
        controller: 'AlimentosCtrl'
      }
    }
  })

  .state('app.alimento', {
    url: "/alimento/:id",
    views: {
      'content': {
        templateUrl: "templates/alimento.html"
        //,controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.peso', {
    url: "/peso",
    views: {
      'content': {
        templateUrl: "templates/peso.html",
        controller: 'PesoCtrl'
      }
    }
  })

  .state('app.estatistica', {
    url: "/estatistica",
    views: {
      'content': {
        templateUrl: "templates/estatistica.html",
        controller: 'EstatisticaCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/estatistica');
});
