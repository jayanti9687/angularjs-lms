angular.module('app').controller('LoginController', ['$scope', '$http', '$state', '$rootScope', '$q', 'HttpService', '$log', 'localStorageService', 'CONSTANTS', 'LoginService', function ($scope, $http, $state, $rootScope, $q, HttpService, $log, localStorageService, CONSTANTS, LoginService) {


    $scope.user = localStorageService.get("user");

    $scope.app.settings.bodyClass = 'login';
    $scope.app.settings.htmlClass = $rootScope.htmlClass.websiteLogin;


    $scope.login = function(){
        LoginService.checkCredentials($scope.email, $scope.password).then(function(responses){
           
            if(responses === undefined){
                $scope.authMsg = "Incorrect credentials";
            } 
            else{
                localStorageService.set("user", responses);
                $state.go("website-student.courses");
            }
        });
    };    

    //TODO: add error handling to the above function using the one below
    
    // $scope.login = function() {
    //     var serverLogin = $http({
    //         method: 'GET',
    //         withCredentials: true,
    //         url: CONSTANTS.rest_url + "students/login", 
    //         params: {"email": "rohankatyal29@gmail.com"}    
    //     });
    //     $q.all([serverLogin]).
    //         then(function (responses) {
    //             localStorageService.set("username", $scope.username);
    //             localStorageService.set("password", $scope.password);
    //             $state.go("website-student.courses");
            
    //         }, function (err) {
    //             if (err.status == 401)
    //                 $scope.authMsg = 'Incorrect credentials';
    //             else
    //                 $scope.authMsg = 'Server Request Error';
    //         });
    // };

}]);