angular.module('traceFood.services', [])

// peso service
.service('PesoService', function($q, $cordovaSQLite) {

	return {
		getAll: function() {
			var deferred = $q.defer(),
				ret = [];
				query = "SELECT id, peso, strftime('%d/%m/%Y', date) as date FROM HistoricoPeso ORDER BY date DESC, peso ASC";

			$cordovaSQLite.execute(db, query).then(function(res) {
				if (res.rows.length > 0) {
					for (var i = 0; i < res.rows.length; i++) {
						var row = res.rows.item(i);

						ret.push({
				            id: row.id,
				            data: row.date,
				            peso: row.peso
						});
					}
				}

				deferred.resolve(ret);
			}, function (err) {
				deferred.reject('Erro ao buscar pesos. ' + err);
				console.error(err);
			});

			return deferred.promise;
		},

		deletePeso: function(peso) {
			var deferred = $q.defer();

			if (peso != undefined && peso != null) {
				var query = 'DELETE FROM HistoricoPeso WHERE id = ?';

				$cordovaSQLite.execute(db, query, [peso.id]).then(function(res) {
					deferred.resolve(true);
				}, function (err) {
					deferred.reject('Erro na exclusão do peso. ' + err);
					console.error(err);
				});
			} else {
				deferred.reject('Objeto do peso undefined ou null');
			}

			return deferred.promise;
		},

		savePeso: function(peso) {
			var deferred = $q.defer();

			if (peso != undefined && peso != null) {
				if (peso.novoPeso != undefined && peso.novoPeso > 0) {
					var query = 'INSERT INTO HistoricoPeso (peso) VALUES (?)';

					$cordovaSQLite.execute(db, query, [peso.novoPeso]).then(function(res) {
						deferred.resolve(true);
					}, function (err) {
						deferred.reject('Erro ao salvar peso. ' + err.message);
						console.error(err);
					});
				} else {
					deferred.reject('Novo peso undefined ou null');
				}
			} else {
				deferred.reject('Objeto do peso undefined ou null');
			}

			return deferred.promise;
		}
	};
})

// alimentos service
.service('AlimentoService', function($q, $cordovaSQLite) {

	/*var emptyModel = {
		id: 0,
		descricao: '',
		valorEnergetico: 0,
		tipo: 0,
		carboidratos: '',
		proteinas: '',
		gordurasTotais: '',
		gordurasTrans: '',
		calcio: '',
		ferro: 0,
		sodio: 0,
		vitaminaA: 0,
		vitaminaC: 0,
		vitaminaD: 0,
		vitaminaE: 0,
		fibraAlimentar: 0,
		colesterol: 0,
		potassio: 0
	};*/

	return {
		getAll: function() {
			var deferred = $q.defer(),
				ret = [];
				query = "SELECT id, descricao FROM Alimento";

			$cordovaSQLite.execute(db, query).then(function(res) {
				if (res.rows.length > 0) {
					for (var i = 0; i < res.rows.length; i++) {
						var row = res.rows.item(i);

						ret.push({
							id: row.id,
							descricao: row.descricao
						});
					}
				}

				deferred.resolve(ret);
			}, function (err) {
				deferred.reject('Erro ao buscar os alimentos. ' + err.message);
				console.error(err);
			});

			return deferred.promise;
		},

		getByModel: function(alimento) {
			var deferred = $q.defer(),
				query = "SELECT * FROM Alimento WHERE id = ?";

			if (alimento != undefined && alimento != null) {
				$cordovaSQLite.execute(db, query, [alimento.id]).then(function(res) {
					if (res.rows.length > 0) {
						var row = res.rows.item(0);

						deferred.resolve({
							id: row.id || 0,
							descricao: row.descricao || '',
							valorEnergetico: row.valorEnergetico || 0,
							tipo: row.tipo || 0,
							carboidratos: row.carboidratos || 0,
							proteinas: row.proteinas || 0,
							gordurasTotais: row.gordurasTotais || 0,
							gordurasTrans: row.gordurasTrans || 0,
							calcio: row.calcio || 0,
							ferro: row.ferro || 0,
							sodio: row.sodio || 0,
							vitaminaA: row.vitaminaA || 0,
							vitaminaC: row.vitaminaC || 0,
							vitaminaD: row.vitaminaD || 0,
							vitaminaE: row.vitaminaE || 0,
							fibraAlimentar: row.fibraAlimentar || 0,
							colesterol: row.colesterol || 0,
							potassio: row.potassio || 0
						});
					} else {
						deferred.resolve(undefined);
					}
				}, function (err) {
					deferred.reject('Erro ao buscar os alimentos. ' + err.message);
					console.error(err);
				});
			} else {
				deferred.reject('Objeto do alimento undefined ou null');
			}

			return deferred.promise;
		},

		deleteAlimento: function(alimento) {
			var deferred = $q.defer();

			if (alimento != undefined && alimento != null) {
				var query = 'DELETE FROM Alimento WHERE id = ?';

				$cordovaSQLite.execute(db, query, [alimento.id]).then(function(res) {
					deferred.resolve(true);
				}, function (err) {
					deferred.reject('Erro na exclusão do alimento. ' + err.message);
					console.error(err);
				});
			} else {
				deferred.reject('Objeto do alimento undefined ou null');
			}

			return deferred.promise;
		},

		saveAlimento: function(alimento) {
			var deferred = $q.defer();

			if (alimento != undefined && alimento != null) {
				var query = "";

				if (alimento.id > 0) {
					query = 'UPDATE Alimento SET ' +
								' descricao = ?, valorEnergetico = ?, tipo = ?, carboidratos = ?, proteinas = ?, ' +
								' gordurasTotais = ?, gordurasTrans = ?, ' +
								' calcio = ?, ferro = ?, sodio = ?, ' +
								' vitaminaA = ?, vitaminaC = ?, vitaminaD = ?, vitaminaE = ?, ' +
								' fibraAlimentar = ?, colesterol = ?, potassio = ? ' +
							' WHERE ' +
								' id = ' + alimento.id;
				} else {
					query = " INSERT INTO Alimento ( " +
								" descricao, valorEnergetico, tipo, " +
								" carboidratos, proteinas, " +
								" gordurasTotais, gordurasTrans, " +
								" calcio, ferro, sodio, " +
								" vitaminaA, vitaminaC, vitaminaD, vitaminaE, " +
								" fibraAlimentar, colesterol, potassio " +
							" ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
				}

				$cordovaSQLite.execute(db, query, [
													('' + alimento.descricao),
													alimento.valorEnergetico,
													alimento.tipo.key,
													alimento.carboidratos || 0,
													alimento.proteinas || 0,
													alimento.gordurasTotais || 0,
													alimento.gordurasTrans || 0,
													alimento.calcio || 0,
													alimento.ferro || 0,
													alimento.sodio || 0,
													alimento.vitaminaA || 0,
													alimento.vitaminaC || 0,
													alimento.vitaminaD || 0,
													alimento.vitaminaE || 0,
													alimento.fibraAlimentar || 0,
													alimento.colesterol || 0,
													alimento.potassio || 0
												]).then(function(res) {
					deferred.resolve(true);
				}, function (err) {
					deferred.reject('Erro ao salvar alimento. ' + err.message);
					console.error(err);
				});
			} else {
				deferred.reject('Objeto do alimento undefined ou null');
			}

			return deferred.promise;
		}

		/*,getEmptyModel: function() {
			var deferred = $q.defer();

			deferred.resolve(emptyModel);

			return deferred.promise;
		}*/
	};
});

  /*function selectAlimentos() {
    var query = "SELECT id, descricao FROM Alimento";

    $cordovaSQLite.execute(db, query).then(function(res) {
      $scope.alimentos = [];

      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          var row = res.rows.item(i);

          $scope.alimentos.push({
            id: row.id,
            descricao: row.descricao
          });
        }
      }
    }, function (err) {
      console.error(err);
    });
  };

  selectAlimentos();*/
    /*if (alimento != undefined && alimento != null) {
      var query = 'DELETE FROM Alimento WHERE id = ?';

      $cordovaSQLite.execute(db, query, [alimento.id]).then(function(res) {
        var index = $scope.alimentos.indexOf(alimento);
        $scope.alimentos.splice(index, 1);
      }, function (err) {
        console.error(err);
      });
    }*/

    /*alert($scope.formAlimento);
    
    if ($scope.formAlimento.$valid) {
      if (a != undefined && a != null) {
        var params = [a.descricao, a.valorEnergetico, a.tipo, a.carboidratos, a.proteinas,
                      a.gordurasTotais, a.gordurasTrans,
                      a.calcio, a.ferro, a.sodio,
                      a.vitaminaA, a.vitaminaC, a.vitaminaD, a.vitaminaE,
                      a.fibraAlimentar, a.colesterol, a.potassio],
            query = ' INSERT INTO Alimento ( ' +
                      ' descricao, valorEnergetico, tipo, carboidratos, proteinas, ' +
                      ' gordurasTotais, gordurasTrans,' +
                      ' calcio, ferro, sodio, ' +
                      ' vitaminaA, vitaminaC, vitaminaD, vitaminaE, ' +
                      ' fibraAlimentar, colesterol, potassio ' +
                    ' ) ' +
                    ' VALUES ' +
                    ' (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

        $cordovaSQLite.execute(db, query, params).then(function(res) {
          init();
          close();
        }, function(err) {
          alert('erro: ' + err);
          console.error(err);
        });
      }
    } else {
      alert('form tem erro');
    }*/