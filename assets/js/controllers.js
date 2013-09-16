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
    $scope.chatmodel = {};

    function getRoom(socket){
        socket.get('/Room/' + $routeParams.chatroomId, function (room) {
            $scope.$apply(function () {
                $scope.chatmodel.room = room;
            });
        });
    };

    function getMessages(socket){
        socket.get('/Message/getMessagesByRoom?roomid=' + $routeParams.chatroomId, function (messages) {
            console.log('Messages received: ', messages);
            $scope.$apply(function () {
                $scope.chatmodel.messages = messages;
            });
        });

        socket.on('message', function (message) {
            console.log(message);
        });
    };

    if (socket){
        getRoom(socket);
        getMessages(socket);
    }else{
        socket = io.connect();
        socket.on('connect', function socketConnected() {
            getRoom(socket);
            getMessages(socket);
        });
    }

    $scope.sendMessage = function() {
        // TODO: Refactor... check for null...
        socket.post('/Message', {
            room: $scope.chatmodel.room.id,
            user: 1,
            content: $scope.chatmodel.newMessage
        }, function (response) {
            console.log(response);
        });
    }
}