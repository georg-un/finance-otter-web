let urlParams = new URLSearchParams(window.location.search);
let start = urlParams.get('start');
let end = urlParams.get('end');
if (start == null) {
    start = 0;
}
if (end == null) {
    end = 15;
}
let targetUrl = 'http://localhost:8080/api/v1/transactions'.concat('?start=', start, "&end=", end);
angular.module('GetRestObject', ['ngResource']);
function Ctrl($scope, $resource) {
    let restservice = $resource(
        targetUrl, {}, {
            query: {method: 'GET', isArray: true}
        }
    );
    $scope.transactions = restservice.query();

    $scope.splitAtComma = function(int) {
        return int.toFixed(2).toString().split('.');
    };

    $scope.convertToDateString = function(timestamp) {
        let date = new Date(timestamp).toISOString().split('T');
        date = date[0].split('-');
        let datestring = date[2] + '.' + date[1] + '.' + date[0];
        return datestring;
    }
}
