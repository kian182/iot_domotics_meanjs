'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.tabs = [
            { paneId: 'tab01', title: 'Room 1', content: 'Tab Number 1 Content', active: true, disabled: false },
            { paneId: 'tab02', title: 'Room 2', content: 'Tab Number 2 Content', active: false, disabled: false },
            { paneId: 'tab03', title: 'Room 3', content: 'Tab Number 3 Content', active: false, disabled: false },
            { paneId: 'tab04', title: 'Living Room', content: 'Tab Number 4 Content', active: false, disabled: false },
            { paneId: 'tab05', title: 'Kitchen', content: 'Tab Number 5 Content', active: false, disabled: false }
        ];

        $scope.swipe = function($event) {
            console.log($event);
        };

        $scope.lightFlag1 = false;
        $scope.lightFlag2 = false;
        $scope.lightFlag3 = false;
        $scope.lightFlag4 = false;
        $scope.lightFlag5 = false;
        $scope.lightFlag6 = false;
        $scope.lightOnCount = 0;
        $scope.lightOffCount = 0;

        var socket = io.connect('http://186.121.197.167:80');
//        var socket = io.connect('http://192.168.0.102');

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

        var switchLightFlags = function(id,value){
            switch(id) {
                case 1:
                    $scope.lightFlag1 = value;
                    break;
                case 2:
                    $scope.lightFlag2 = value;
                    break;
                case 3:
                    $scope.lightFlag3 = value;
                    break;
                case 4:
                    $scope.lightFlag4 = value;
                    break;
                case 5:
                    $scope.lightFlag5 = value;
                    break;
                case 6:
                    $scope.lightFlag6 = value;
                    break;
            }
        };

        $scope.lightButton = function(option){
            $scope.lightFlag=false;
            console.log(option);
            var buttonId = "#switchButton"+option;
            var messageFlag = $(buttonId).text();
            var message = $(buttonId).text()+' '+option;
            socket.send(message);
//            $('#messages').append('<li>me: ' + message + '</li>');
            if (messageFlag == 'turn on'){
                $(buttonId).text('turn off');
                switchLightFlags(option,true);
                $scope.lightOnCount++;
            }
            else{
                $(buttonId).text('turn on');
                switchLightFlags(option,false);
                $scope.lightOffCount++;
            }
            console.log("Works");
        }

	}
]);