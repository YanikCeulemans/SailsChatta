console.log('loading controllers...');

/////////////////////////////////////
// TODO: Refactor the named functions
/////////////////////////////////////
function HomeCtrl($scope, $http, userService, socketService) {
    var socketPromise = socketService.getSocketPromise();

    $scope.homeModel = {};

    socketPromise.then(function (socket) {
        console.log('socket ready.', socket);
        socket.get('/room', function(rooms) {
            console.log('Room list recieved: ', rooms);
            $scope.$apply(function() {
                $scope.homeModel.rooms = rooms;
            });
        });

        socket.on('message', function messageReceived(message) {
            console.log('Message received: ', message);
            // TODO: perhaps this could be cleaner...
            if (message.model === 'room' && message.verb === 'create') {
                $scope.$apply(function() {
                    $scope.homeModel.rooms.push(message.data);
                });
            }
        });

        // TODO: Is this legit ?
        $scope.createUser = function () {
            socket.post('/User/uniqueCreate?nickname=' + $scope.nickname, function (response) {
                // I am not sure whether this has to be wrapped in a $apply
                $scope.$apply(function () {
                    $scope.homeModel.user = response;
                    userService.user = response;
                });
            });
        };
    });
}

function ChatroomCtrl($scope, $http, $routeParams, userService, socketService) {
    $scope.chatmodel = {
        messages: []
    };

    var socketPromise = socketService.getSocketPromise();

    socketPromise.then(function (socket) {
        console.log('socket ready for chatroom', socket);
        socket.get('/Room/' + $routeParams.chatroomId, function (room) {
            $scope.$apply(function () {
                $scope.chatmodel.room = room;
            });
        });
        socket.on('MsgCreatedRoom' + $routeParams.chatroomId, function (message) {
            console.log('Message received: ', message);
            $scope.$apply(function () {
                $scope.chatmodel.messages.push(message);
            });
        });

        $scope.sendMessage = function() {
            if(!userService.user){
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
    });

}