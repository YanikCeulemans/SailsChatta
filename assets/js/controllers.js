console.log('loading controllers...');
function HomeCtrl($scope, $http){
    $scope.testModel = {};

    (function (io) {
        var socket = io.connect();

        socket.on('connect', function socketConnected () {
            socket.get('/room', function (rooms) {
                console.log('Room list recieved: ', rooms);
                $scope.$apply(function () {
                    $scope.testModel.rooms = rooms;
                })
            });

            socket.on('message', function messageReceived (message) {
                console.log('Message received: ',message);
            });
        })
    })(window.io);
}

function ChatroomCtrl($scope, $http, $routeParams){
    $scope.chatmodel = {};

    $http.get('/room/' + $routeParams.chatroomId).success(function(data){
            $scope.chatmodel.room = data;
        });

    $scope.sendMessage = function(){
        console.log($scope.chatmodel.newMessage);
        socket.get('/room/postMessage?message=' + $scope.chatmodel.newMessage, function(response){
                console.log('message added: ' + response);
                $scope.$apply(function(){
                        $scope.chatmodel.room = response;
                    })
            })
        $scope.chatmodel.newMessage = '';
    }
}
