'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.lightFlag = false;
        $scope.lightOnCount = 0;
        $scope.lightOffCount = 0;

        var socket = io.connect('http://192.168.0.102:8080');

        socket.on('connect', function() {
            $('#messages').html('Connected to the server.');
        });

        socket.on('message', function(message) {
            $('#status').html(message);
        });

        socket.on('disconnect', function() {
            $('#messages').html('<li>Disconnected from the server.</li>');
            ('#status').html('disconnected');
        });

        $scope.lightButton = function(){

            var messageFlag = $('#switchButton').text();
            var message = $('#switchButton').text();
            console.log(message)
            socket.send(message);
//            $('#messages').append('<li>me: ' + message + '</li>');
            if (messageFlag == 'turn on'){
                $('#switchButton').text('turn off');
                $scope.lightFlag = true;
                $scope.lightOnCount++;
            }
            else{
                $('#switchButton').text('turn on');
                $scope.lightFlag = false;
                $scope.lightOffCount++;
            }
            console.log("Works");
        }

	}
]);