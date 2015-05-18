/**
 * Created by Kevin on 18/05/2015.
 */



'use strict';

angular.module('users').controller('LayoutController', ['$scope', '$rootScope' , '$http', '$location', 'Authentication',
    function($scope, $rootScope, $http, $location, Authentication) {
        $scope.authentication = Authentication;

        //Safe Apply Function
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if(fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        //LoginFlag
        $scope.safeApply(function() {
            $rootScope.loginFlag = true;
        });

    }
]);




