// get url params
let urlParams = new URLSearchParams(window.location.search);
let transactionId = urlParams.get('id');
let targetUrl = 'http://localhost:8080/api/v1';
let editButtonTarget = '/media/Daten-Partition/Repositories/accounting_otter_webapp/payment-editor.html?mode=edit&id='.concat(transactionId);  // TODO: switch to hostname global


convertToCurrency = function(float) {
    return currency(float, { precision: 2 }).toString();
};

convertToShortName = function(firstName, lastName) {
    return firstName.concat(' ', lastName.charAt(0), '.')
};



$(document).ready(function() {
    $.ajax({
        type: 'GET',
        dataType: "json",
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

            if ( data.description !== '') {
                $('#payment-description').append(
                    '<p><small>DESCRIPTION</small></p>' +
                    '<div style="padding: 4px 0 8px 0;">' +
                        '<p class="large">' + data.description + '</p>' +
                    '</div>' +
                    '<hr/>'
                );
            }

            $.each(data.debits, function(index, value) {
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

            $("#edit-button").attr('href', editButtonTarget);

        }
    })
});


$('#delete-button').click( function() {
    $.ajax({
        url: targetUrl.concat('/payments/', transactionId),
        type: 'DELETE',
        success: function() {
            window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/transactions.html");  // TODO: switch to hostname global
        }
    });
});