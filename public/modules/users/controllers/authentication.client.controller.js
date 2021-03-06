'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$rootScope' ,'$http', '$location', 'Authentication',
	function($scope, $rootScope , $http, $location, Authentication) {
		$scope.authentication = Authentication;
        $rootScope.loginFlag = false;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
                console.log('signup');
                $scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
            console.log('signin');
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
                $rootScope.loginFlag = true;
				$location.path('/home');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);