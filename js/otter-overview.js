let targetUrl = 'http://localhost:8080/api/v1';

splitAtComma = function(int) {
    return int.toFixed(2).toString().split('.');
};

convertToShortName = function(firstName, lastName) {
    return firstName.concat(' ', lastName.charAt(0), '.')
};

getUserPicUrl = function(targetUrl, userId) {
    return targetUrl.concat('/user/', userId, '/pic');
};


// instantiate keycloak
let keycloak = Keycloak();


// load user cards
$(document).ready(function() {
    keycloak.init({ onLoad: 'login-required' }).success(function(authenticated) {
        $.ajax({
            type: 'GET',
            dataType: "json",
            headers: {'Authorization': 'Bearer ' + keycloak.token},
            url: targetUrl.concat('/user'),
            success: function (data) {
                $.each(data, function(index, value) {
                        let card =
                            "<div class='user-card'>" +
                                "<div class='user-card-img valign-wrapper'>" +
                                    "<img class='circle avatar' src='" + getUserPicUrl(targetUrl, value.userId) + "'>" +
                                "</div>" +
                                "<div class='user-card-name'>" +
                                    "<p class='x-large' style='color:black;'>" +
                                        convertToShortName(value.firstName, value.lastName) +
                                    "</p>" +
                                "</div>" +
                                "<div class='user-card-amount' style='text-align:right;'>" +
                                    "<p class='x-large' style='color:black; display:inline;'>" +
                                        splitAtComma(value.sumDebitAmounts)[0] + "." +
                                    "</p>" +
                                    "<p style='color:black; display:inline;'>" +
                                        splitAtComma(value.sumDebitAmounts)[1] +
                                    "</p>" +
                                "</div>" +
                            "</div>";

                        $("#credit-overview-container").append(card);
                    }
                )
            }
        })
    }).error(function() {
        console.log('Failed to initialize Keycloak.');
    });
});