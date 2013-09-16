console.log('loading controllers...');
var socket;

function HomeCtrl($scope, $http) {
    $scope.testModel = {};

    function getRooms(socket) {
        if ( !! !socket) {
            return false;
        }
        socket.get('/room', function(rooms) {
            console.log('Room list recieved: ', rooms);
            $scope.$apply(function() {
                $scope.testModel.rooms = rooms;
            });
        });
    }

    function listenRoomChanges(socket) {
        if ( !! !socket) {
            return false;
        }
        socket.on('message', function messageReceived(message) {
            console.log('Message received: ', message);
            if (message.model === 'room' && message.verb === 'create') {
                $scope.$apply(function() {
                    $scope.testModel.rooms.push(message.data);
                });
            }
        });
    }

    (function(io) {
        if (socket) {
            getRooms(socket);
            listenRoomChanges(socket);
        } else {
            socket = io.connect();

            socket.on('connect', function socketConnected() {
                getRooms(socket);
                listenRoomChanges(socket);
            });
        }

    })(window.io);
}

function ChatroomCtrl($scope, $http, $routeParams) {
    $scope.chatmodel = {};

    $http.get('/room/' + $routeParams.chatroomId).success(function(data) {
        $scope.chatmodel.room = data;
    });

    $scope.sendMessage = function() {
        console.log($scope.chatmodel.newMessage);
        socket.get('/room/postMessage?message=' + $scope.chatmodel.newMessage, function(response) {
            console.log('message added: ' + response);
            $scope.$apply(function() {
                $scope.chatmodel.room = response;
            })
        })
        $scope.chatmodel.newMessage = '';
    }
}