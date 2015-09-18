angular.module('calc', ['components'], function($provide) {
	// Prevent Angular from sniffing for the history API
	// since it's not supported in packaged apps.
	$provide.decorator('$window', function($delegate) {
		$delegate.history = null;
		return $delegate;
	});
})

.controller('CalcControl', function ($scope, $timeout) {
    $scope.calcM = new Calculadora();

    // on ready
    $timeout(function () {
        $scope.shift = false;

        $scope.keyboard = {
            50: ['concatNumber', 2],
            51: ['concatNumber', 3],
            52: ['concatNumber', 4],
            53: ['concatNumber', 5],
            54: ['concatNumber', 6],
            55: ['concatNumber', 7],
            49: ['concatNumber', 1],
            56: ['concatNumber', 8],
            57: ['concatNumber', 9],
            48: ['concatNumber', 0],
            187: ['equals', '='],
            13: ['equals', '='],
            190: ['concatNumber', '.'],
            189: ['doOperation', '-'],
            191: ['doOperation', '/'],
            27: ['calcM.clearAll'], // esc
            8: ['calcM.clearLast'], // backspace
            97: ['concatNumber', 1],  // numberpad
            98: ['concatNumber', 2],
            99: ['concatNumber', 3],
            100: ['concatNumber', 4],
            101: ['concatNumber', 5],
            102: ['concatNumber', 6],
            103: ['concatNumber', 7],
            104: ['concatNumber', 8],
            105: ['concatNumber', 9],
            96: ['concatNumber', 0],
            110: ['concatNumber', '.'],
            109: ['doOperation', '-'],
            111: ['doOperation', '/'],
            107: ['doOperation', '+'],
            106: ['doOperation', '*']
        };

        $scope.shiftKeyboard = {
            187: ['doOperation', '+'],
            56: ['doOperation', '*']
        };
    });

    $scope.concatNumber = function (number) {
        if (number == '.' && ($scope.calcM.workNumber == '' || $scope.calcM.workNumber.indexOf('.') != -1))
            return;

        $scope.calcM.workNumber += ('' + number);
    }

    $scope.doOperation = function (operation) {
        var modelOperation = $scope.calcM.operation;

        if ($scope.calcM.workNumber == '') {
            if (modelOperation != operation && $scope.calcM.result != '') {
                $scope.calcM.operation = operation;
            }

            return;
        }

        var workN = $scope.calcM.workNumber,
            result = $scope.calcM.result;

        if (result != '') {
            result = $scope.calcM.doOperation();
        } else {
            result = workN;
        }

        $scope.calcM.result = result;
        $scope.calcM.operation = operation;
        $scope.calcM.workNumber = '';
    }

    $scope.equals = function () {
        if ($scope.calcM.result != '' && $scope.calcM.workNumber != '' && $scope.calcM.operation != '') {
            $scope.calcM.result = $scope.calcM.doOperation();
            $scope.calcM.operation = '';
            $scope.calcM.workNumber = '';
        }
    }

    $scope.invertSignal = function () {
        if ($scope.calcM.result != '') {
            $scope.calcM.result = $scope.calcM.doOperation('+-');
        }
    }

    $scope.handleKeyDown = function ($event) {
		if ($event) {
			if ($event.ctrlKey && $event.keyCode == 67) {
				return;
			}

			var clicked = null;
			if ($event.which == 16) {
				$scope.shift = true;
			} else if ($scope.shift) {
				clicked = $scope.shiftKeyboard[$event.which];
			} else if (!$scope.shift) {
				clicked = $scope.keyboard[$event.which];
			}

			if (clicked != null) {
				var method = clicked[0],
					param;

				if (clicked.length > 1) {
					param = clicked[1];
				}

				if ($event.which == 27) {
					$scope.calcM.clearAll();
				} else if ($event.which == 8) {
					$scope.calcM.clearLast();
				} else {
					$scope[method](param);
				}
			}
		}
    }

	$scope.handlerKeyUp = function($event) {
		if ($event) {
			if ($event.which == 16) {
				$scope.shift = false;
			}
		}
	}
})

.directive('ngKeydown', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			// this next line will convert the string
			// function name into an actual function
			var functionToCall = scope.$eval(attrs.ngKeydown);
			elem.on('keydown', function(e) {
				// on the keydown event, call my function
				// and pass it the keycode of the key
				// that was pressed
				// ex: if ENTER was pressed, e.which == 13
				if (functionToCall) {
					functionToCall(e);
				}
			});
		}
	};
})

.directive('ngKeyUp', function() {
	return {
		restrict: 'A',
		link: function(scope, elem, attrs) {
			// this next line will convert the string
			// function name into an actual function
			var functionToCall = scope.$eval(attrs.ngKeyUp);
			elem.on('keyup', function(e) {
				// on the keydown event, call my function
				// and pass it the keycode of the key
				// that was pressed
				// ex: if ENTER was pressed, e.which == 13
				if (functionToCall) {
					functionToCall(e);
				}
			});
		}
	};
});