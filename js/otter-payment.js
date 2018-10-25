// get url params
let urlParams = new URLSearchParams(window.location.search);
let transactionId = urlParams.get('id');
let targetUrl = 'http://localhost:8080/api/v1/payments/'.concat(transactionId);
let editButtonTarget = '/media/Daten-Partition/Repositories/accounting_otter_webapp/payment-editor.html?mode=edit&id='.concat(transactionId);  // TODO: switch to hostname global

angular.module('GetRestObject', ['ngResource']);
function Ctrl($scope, $resource, $http) {
    var restservice = $resource(
        targetUrl, {}, {
            query: {method: 'GET'}
        }
    );
    $scope.payment = restservice.query();

    $scope.editButtonTarget = editButtonTarget;

    $scope.deletePayment = function() {
        $http.delete('http://localhost:8080/api/v1/payments/'.concat($scope.payment.transactionId));  // TODO: this works only when button is long pressed
        window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/transactions.html");  // TODO: switch to hostname global
    };

    $scope.convertToCurrency = function(float) {
        return currency(float, { precision: 2 }).toString();
    };

    $scope.convertToShortName = function(firstName, lastName) {
        return firstName.concat(' ', lastName.charAt(0), '.')
    };
}
