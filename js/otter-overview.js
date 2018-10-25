let targetUrl = 'http://localhost:8080/api/v1';
angular.module('GetRestObject', ['ngResource']);
function Ctrl($scope, $resource) {
    let restservice = $resource(
        targetUrl.concat('/user'), {}, {
            query: {method: 'GET', isArray: true}
        }
    );
    $scope.users = restservice.query();

    $scope.splitAtComma = function(int) {
        return int.toFixed(2).toString().split('.');
    };

    $scope.convertToShortName = function(firstName, lastName) {
        return firstName.concat(' ', lastName.charAt(0), '.')
    };

    $scope.getUserPicUrl = function(userId) {
        return targetUrl.concat('/user/', userId, '/pic');
    }
}
