var app = angular.module('app', []).
config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: HomeCtrl,
        templateUrl: 'templates/home.html'
    }).
    when('/chatroom/:chatroomId', {
        controller: ChatroomCtrl,
        templateUrl: 'templates/chatroom.html'
    }).
    otherwise({
        redirectTo: '/'
    });
});

app.service('userService', function($rootScope, $timeout) {
    this.user = {};

    /*setTimeout(function () {
        $rootScope.$apply(function () {
            this.user = {nickname: 'this is a nickname'}
        });
    }, 5000);*/

    $timeout(function () {
        this.user = {nickname: 'a nickname'};
    }, 5000);

    /*this.getUser = function () {
        return user;
    };

    this.setUser = function (toSet) {
        $rootScope.$apply(function () {
            user = toSet;
        });
    };*/
});

app.service('socketService', ['$q', '$rootScope', function($q, $rootScope) {
    var socket;
    var deferrer = $q.defer();
    
    this.getSocketPromise = function () {
        if (socket){
            deferrer.resolve(socket);
        }else{
            socket = io.connect();
            socket.on('connect', function () {
                // This code is outside of the angular digest cycle -> call apply !
                $rootScope.$apply(function () {
                    deferrer.resolve(socket);
                });
            });
        }
        return deferrer.promise;
    }
}]);

app.directive('chattaShow', function() {
    return function(scope, element, attrs) {
        element.addClass('vdrop');
        scope.$watch(attrs.chattaShow, function(newVal, oldVal) {
            if (newVal !== undefined) {
                element.toggleClass('shown', !! newVal);
            }
        });
    };
});