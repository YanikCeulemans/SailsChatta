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

app.service('userService', function() {
    this.user = {};
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

app.directive('chattaVdropToggle', function() {
    return function(scope, element, attrs) {
        element.addClass('vdrop');
        scope.$watch(attrs.chattaVdropToggle, function(newVal, oldVal) {
            if (newVal) {
                element.toggleClass('shown', !! newVal);
            }
        });
    };
});