angular.module('components', [])

.directive('botoes', function () {
    return {
        restrict: 'E',
        transclude: true,
        /*scope: {},
        controller: function ($scope, $element) {
        },*/
        template: [
            '<div>',
                '<div class="row">',
                    '<button type="button" class="botao" ng-click="invertSignal()">&plusmn;</button>',
                    '<button type="button" class="botao" ng-click="calcM.clearLast()">&larr;</button>',
                    '<button type="button" class="botao" ng-click="calcM.clearAll()">C</button>',
                    '<button type="button" class="botao botao-func" ng-click="doOperation(\'+\')">+</button>',
                '</div>',

                '<div class="row">',
                    '<button type="button" class="botao" ng-click="concatNumber(\'7\')">7</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'8\')">8</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'9\')">9</button>',
                    '<button type="button" class="botao botao-func" ng-click="doOperation(\'-\')">-</button>',
                '</div>',

                '<div class="row">',
                    '<button type="button" class="botao" ng-click="concatNumber(\'4\')">4</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'5\')">5</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'6\')">6</button>',
                    '<button type="button" class="botao botao-func" ng-click="doOperation(\'*\')">*</button>',
                '</div>',

                '<div class="row">',
                    '<button type="button" class="botao" ng-click="concatNumber(\'1\')">1</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'2\')">2</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'3\')">3</button>',
                    '<button type="button" class="botao botao-func" ng-click="doOperation(\'/\')">&divide;</button>',
                '</div>',

                '<div class="row">',
                    '<button type="button" class="botao botao-largo" ng-click="concatNumber(\'0\')">0</button>',
                    '<button type="button" class="botao" ng-click="concatNumber(\'.\')">.</button>',
                    '<button type="button" class="botao botao-func" ng-click="equals()" autofocus>=</button>',
                '</div>',
            '</div>'
        ].join(''),
        replace: true
    };
});

//'<div class="row">',
//    '<div class="row-line">',
//        '<div class="row">',
//            '<button type="button" class="botao" ng-click="concatNumber(\'1\')">1</button>',
//            '<button type="button" class="botao" ng-click="concatNumber(\'2\')">2</button>',
//            '<button type="button" class="botao" ng-click="concatNumber(\'3\')">3</button>',
//            '<button type="button" class="botao" ng-click="clear()">CE</button>',
//        '</div>',
//        '<div class="row">',
//            '<button type="button" class="botao botao-largo" ng-click="concatNumber(\'0\')">0</button>',
//            '<button type="button" class="botao" ng-click="concatNumber(\'.\')">.</button>',
//            '<button type="button" class="botao" ng-click="doOperation(\'+-\')">&plusmn;</button>',
//        '</div>',
//    '</div>',

//    '<div class="row-line">',
//        '<button type="button" class="botao botao-alto" ng-click="equals()">=</button>',
//    '</div>',
//'</div>',