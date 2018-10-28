// get url params
let urlParams = new URLSearchParams(window.location.search);
let transactionId = urlParams.get('id');
let targetUrl = 'http://localhost:8080/api/v1';



convertToCurrency = function(float) {
    return currency(float, { precision: 2 }).toString();
};

convertToShortName = function(firstName, lastName) {
    return firstName.concat(' ', lastName.charAt(0), '.')
};


// instatiate keycloak
let keycloak = Keycloak();


$(document).ready(function() {
    keycloak.init({ onLoad: 'login-required' }).success(function(authenticated) {
        $.ajax({
            type: 'GET',
            dataType: "json",
            headers: {'Authorization': 'Bearer ' + keycloak.token},
            url: targetUrl.concat('/payments/', transactionId),
            success: function (data) {

                $('.payment-header-shop').append(
                    '<h3>' + data.shop + '</h3>'
                );

                $('.payment-header-amount').append(
                    '<h1>€ ' + convertToCurrency(data.sumAmount) + '</h1>'
                );

                $('.payment-header-category').append(
                    "<p style='vertical-align: middle'>" + data.category + '</p>'
                );

                if (data.description !== '') {
                    $('#payment-description').append(
                        '<p><small>DESCRIPTION</small></p>' +
                        '<div style="padding: 4px 0 8px 0;">' +
                        '<p class="large">' + data.description + '</p>' +
                        '</div>' +
                        '<hr/>'
                    );
                }

                $.each(data.debits, function (index, value) {
                    let card =
                        "<div class='debit-card' style='padding-bottom: 4px'>" +
                        "<div class='debit-card-user'>" +
                        "<p class='large'>" +
                        convertToShortName(value.debtorFirstName, value.debtorLastName) +
                        "</p>" +
                        "</div>" +
                        "<div class='debit-card-amount'>" +
                        "<p class='large'>" + convertToCurrency(value.amount) + " €</p>" +
                        "</div>" +
                        "</div>";

                    $('.debit-blockquote').append(card);
                });

                $("#edit-button").attr('href', '/payment-editor.html?mode=edit&id='.concat(transactionId));

            }
        });
    }).error(function() {
        console.log('Failed to initialize Keycloak.');
    });
});


$('#delete-button').click( function() {

    keycloak.updateToken(30).success(function() {
        $.ajax({
            url: targetUrl.concat('/payments/', transactionId),
            headers: {'Authorization': 'Bearer ' + keycloak.token},
            type: 'DELETE',
            success: function() {
                window.location.replace("/transactions.html");
            }
        });
    }).error(function() {
        console.log('Failed to refresh token');
    });

});