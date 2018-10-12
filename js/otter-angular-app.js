// get url params
let urlParams = new URLSearchParams(window.location.search);
let mode = urlParams.get('mode');

let targetUrl = 'http://localhost:8080/api/v1/user';
angular.module('GetRestObject', ['ngResource']);
function Ctrl($scope, $resource, $http) {
    let restservice = $resource(
        targetUrl, {}, {
            query: {method: 'GET', isArray: true}
        }
    );
    $scope.users = restservice.query();

    $scope.mode = mode;

    $scope.convertToShortName = function(firstName, lastName) {
        return firstName.concat(' ', lastName.charAt(0), '.')
    };
};