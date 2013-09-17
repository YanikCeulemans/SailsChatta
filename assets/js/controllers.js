console.log('loading controllers...');
var socket;

/////////////////////////////////////
// TODO: Refactor the named functions
/////////////////////////////////////
function HomeCtrl($scope, $http) {
    $scope.testModel = {};

    function getRooms(socket) {
        if (!!!socket) {
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
        if (!!!socket) {
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
    $scope.chatmodel = {
        messages: []
    };

    function getRoom(socket){
        socket.get('/Room/' + $routeParams.chatroomId, function (room) {
            $scope.$apply(function () {
                $scope.chatmodel.room = room;
            });
        });
    };

    function lift(socket) {
        getRoom(socket);
        listenMessageChanges(socket);
    };

    function listenMessageChanges(socket) {
        socket.on('MsgCreatedRoom' + $routeParams.chatroomId, function (message) {
            console.log('Message received: ', message);
            $scope.$apply(function () {
                $scope.chatmodel.messages.push(message);
            });
        });
    };

    (function(io) {
        if (socket) {
            lift(socket);
        } else {
            socket = io.connect();

            socket.on('connect', function socketConnected() {
                lift(socket);
            });
        }

    })(window.io);

    $scope.sendMessage = function() {
        // TODO: Refactor... check for null...
        socket.post('/Message/createMsg', {
            room: $routeParams.chatroomId,
            user: 1,
            content: $scope.chatmodel.newMessage
        }, function (response) {
            // Because we go over the socket... we don't need this !
            //console.log('response: ', response);
        });
        $scope.chatmodel.newMessage = '';
    }
}