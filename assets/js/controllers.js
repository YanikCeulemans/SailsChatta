console.log('loading controllers...');

/////////////////////////////////////
// TODO: Refactor the named functions
/////////////////////////////////////
function HomeCtrl($scope, $http, userService, socketService) {
    var socketPromise = socketService.getSocketPromise();

    $scope.testModel = {};

    $scope.createUser = function () {
        socket.post('/User/uniqueCreate?nickname=' + $scope.nickname, function (response) {
            // I am not sure whether this has to be wrapped in a $apply
            $scope.$apply(function () {
                $scope.testModel.user = response;
                userService.user = response;
            });
        });
    };

    socketPromise.then(function (socket) {
        console.log('socket ready.', socket);
        socket.get('/room', function(rooms) {
            console.log('Room list recieved: ', rooms);
            $scope.$apply(function() {
                $scope.testModel.rooms = rooms;
            });
        });

        socket.on('message', function messageReceived(message) {
            console.log('Message received: ', message);
            // TODO: perhaps this can be cleaner...
            if (message.model === 'room' && message.verb === 'create') {
                $scope.$apply(function() {
                    $scope.testModel.rooms.push(message.data);
                });
            }
        });
    });
}

function ChatroomCtrl($scope, $http, $routeParams, userService) {
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
        if(!!!userService.user){
            console.log('A user should be defined by now...');
            return;
        }
        // TODO: Refactor... check for null...
        socket.post('/Message/createMsg', {
            room: $routeParams.chatroomId,
            user: userService.user.id,
            content: $scope.chatmodel.newMessage
        });
        $scope.chatmodel.newMessage = '';
    }
}