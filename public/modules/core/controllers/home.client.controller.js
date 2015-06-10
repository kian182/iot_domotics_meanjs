'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope','$timeout', 'Authentication',
	function($scope, $rootScope, $timeout,  Authentication) {
        //This provides Authentication context.
        $scope.authentication = Authentication;

        /*Lights Flags*/
        $scope.lightStatus1 = true;
        $scope.lightStatus2 = true;
        $scope.lightStatus3 = true;
        $scope.lightStatus4 = true;
        $scope.lightStatus5 = true;
        /*Servo Flags*/
        $scope.servoStatus1 = false;
        $scope.servoStatus2 = false;
        /*Panel Flags*/
        $scope.panelRoom1 = true;
        $scope.panelRoom2 = false;
        $scope.panelRoom3 = false;
        $scope.panelLvRoom = false;
        $scope.panelKitchen = false;
        /*Temperature*/
        $scope.temperatureAux="Getting Actual Temperature...";
        $scope.temperature=$scope.temperatureAux;
        /*Lighs Counters*/
        $scope.lightOnCount = 0;
        $scope.lightOffCount = 0;

        /*Navbar Settings*/
        $scope.tabs = [
            { paneId: 'tab01', title: 'Room 1', content: '', active: true, disabled: false },
            { paneId: 'tab02', title: 'Room 2', content: '', active: false, disabled: false },
            { paneId: 'tab03', title: 'Room 3', content: '', active: false, disabled: false },
            { paneId: 'tab04', title: 'Living Room', content: '', active: false, disabled: false },
            { paneId: 'tab05', title: 'Kitchen', content: '', active: false, disabled: false }
        ];

        /*Paho Initial Client Variable*/
        var client = new Paho.MQTT.Client("test.mosca.io", 80, "myclientid_" + parseInt(Math.random() * 100, 10));
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        // connect the client
        client.connect({onSuccess:onConnect});

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

        // called when the client connects
        function onConnect() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            client.subscribe("/iotDomoticsKR182");
        }

        // called when the client loses its connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:"+responseObject.errorMessage);
            }
        }

        // called when a message arrives
        function onMessageArrived(message) {
            var arrvMessage = message.payloadString;
            var dataTemp = arrvMessage.split(",");
            if(dataTemp[0]==='temp'){
                var temperature = parseFloat(dataTemp[1]).toFixed(2);;
                $scope.safeApply(function() {
                    $scope.temperature=temperature+' °C';
                });
            }
        }


        var setPanelFlags = function(room1,room2,room3,lvroom,kitchen){
            $scope.panelRoom1 = room1;
            $scope.panelRoom2 = room2;
            $scope.panelRoom3 = room3;
            $scope.panelLvRoom = lvroom;
            $scope.panelKitchen = kitchen;
        };

        $scope.panelView = function(panel){
            console.log(panel);
            if(panel=='Room 1'){
                console.log('1');
                setPanelFlags(true,false,false,false,false);
            }else if(panel=='Room 2'){
                console.log('2');
                setPanelFlags(false,true,false,false,false);
            }else if(panel =='Room 3'){
                console.log('3');
                setPanelFlags(false,false,true,false,false);
            }else if(panel == 'Living Room'){
                console.log('4');
                setPanelFlags(false,false,false,true,false);
            }else{
                console.log('5');
                setPanelFlags(false,false,false,false,true);
            }
        };

        var switchLightFlags = function(id,value){
            switch(id) {
                case 1:
                    $scope.lightStatus1 = value;
                    break;
                case 2:
                    $scope.lightStatus2 = value;
                    break;
                case 3:
                    $scope.lightStatus3 = value;
                    break;
                case 4:
                    $scope.lightStatus4 = value;
                    break;
                case 5:
                    $scope.lightStatus5 = value;
                    break;
                case 6:
                    $scope.lightStatus6 = value;
                    break;
            }
        };

        $scope.lightButton = function(status,option){
            var messageFlag = !status? 'turn on':'turn off';
            console.log('Option Selected: '+option);
            var message = messageFlag+' '+option;
            console.log('message: '+message);
            var pahoMessage = new Paho.MQTT.Message(message);
            pahoMessage.destinationName = "/iotDomoticsKR182";
            client.send(pahoMessage);
            if (messageFlag == 'turn on'){
                switchLightFlags(option,true);
                $scope.lightOnCount++;
            }
            else{
                switchLightFlags(option,false);
                $scope.lightOffCount++;
            }
            console.log('Message Sent...');
        };

        $scope.servoMotor = function(status, option){
            var servoFlag = !status? 'servo on':'servo off';
            console.log(option);
            var servoMessage = servoFlag+' '+option;
            console.log('servoMessage: '+servoMessage);
            var pahoMessage = new Paho.MQTT.Message(servoMessage);
            pahoMessage.destinationName = "/iotDomoticsKR182";
            client.send(pahoMessage);
        };

        var getTemperature = function(){
            $timeout(function(){
                try{
                    $scope.safeApply(function() {
                        $scope.temperature=$scope.temperatureAux;
                        console.log($scope.temperature);
                        getTemperature();
                    });
                }
                catch(e){
                    console.log('Log Out');
                }
            }, 3000);
        };

        var init = function(){
            //getTemperature();
        };

        init();

//
//        $scope.changeDetect2 = function(id){
//            console.log('Change Detected');
//            //console.log('id: '+id);
//            if (id){
//                console.log('On');
//            }else{
//                console.log('Off');
//            }
//        };
//
//        $scope.swipe = function($event) {
//            console.log($event);
//        };
//

//
//        var socket = io.connect('http://192.168.1.102:8080');
////        var socket = io.connect('http://192.168.0.102');
//
//        socket.on('connect', function() {
//            $('#messages').html('Connected to the server.');
//        });
//
//        socket.on('temp', function(data) {
//            $scope.temperatureAux=data;
//        });
//

//
//        $scope.servoMotor = function(status, option){
//            var servoFlag = !status? 'servo on':'servo off';
//            console.log(option);
//            var servoMessage = servoFlag+' '+option;
//            console.log('servoMessage: '+servoMessage);
//            socket.send(servoMessage);
//            console.log('servoFlag: '+servoFlag);
//        };
//
//        //Safe Apply Function
//        $scope.safeApply = function(fn) {
//            var phase = this.$root.$$phase;
//            if(phase == '$apply' || phase == '$digest') {
//                if(fn && (typeof(fn) === 'function')) {
//                    fn();
//                }
//            } else {
//                this.$apply(fn);
//            }
//        };
//
//        var getTemperature = function(){
//            $timeout(function(){
//                try{
//                    $scope.safeApply(function() {
//                        $scope.temperature=$scope.temperatureAux;
//                        console.log($scope.temperature);
//                        getTemperature();
//                    });
//                }
//                catch(e){
//                    console.log('Log Out');
//                }
//            }, 3000);
//        };
//


        /*-----------------------*/
//
//        console.log("myclientid_" + parseInt(Math.random() * 100, 10));
//        var client = new Paho.MQTT.Client("test.mosca.io", 80, "myclientid_" + parseInt(Math.random() * 100, 10));
//
//        // set callback handlers
//        client.onConnectionLost = onConnectionLost;
//        client.onMessageArrived = onMessageArrived;
//
//        // connect the client
//        client.connect({onSuccess:onConnect});
//
//
//        // called when the client connects
//        function onConnect() {
//            // Once a connection has been made, make a subscription and send a message.
//            console.log("onConnect");
//            client.subscribe("/topicKR");
//            var message = new Paho.MQTT.Message("dimmer");
//            message.destinationName = "/topicKR";
//            client.send(message);
//        }
//
//        // called when the client loses its connection
//        function onConnectionLost(responseObject) {
//            if (responseObject.errorCode !== 0) {
//                console.log("onConnectionLost:"+responseObject.errorMessage);
//            }
//        }
//
//        // called when a message arrives
//        function onMessageArrived(message) {
//            console.log("onMessageArrived:"+message.payloadString);
//        }

    }
]);




