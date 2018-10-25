let urlParams = new URLSearchParams(window.location.search);
let start = urlParams.get('start');
let end = urlParams.get('end');
if (start == null) {
    start = 0;
}
if (end == null) {
    end = 15;
}
let targetUrl = 'http://localhost:8080/api/v1';

convertToDateString = function(timestamp) {
    let date = new Date(timestamp).toISOString().split('T');
    date = date[0].split('-');
    let datestring = date[2] + '.' + date[1] + '.' + date[0];
    return datestring;
};

splitAtComma = function(int) {
    return int.toFixed(2).toString().split('.');
};


// add transaction cards
$(document).ready(function() {
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: targetUrl.concat('/transactions?start=', start, "&end=", end),
        success: function (data) {
            $.each(data, function(index, value) {
                let card =
                   "<a href='payment.html?id=" + value.transactionId + "'>" +
                       "<div class='transaction-grid-card z-depth-1 hoverable'>" +
                            "<div class='transaction-card-avatar valign-wrapper'>" +
                                "<img class='circle avatar' src='" + targetUrl + "/user/" + value.userId + "/pic'>" +
                            "</div>" +
                            "<div class='transaction-card-date transaction-card-first-row'>" +
                                "<p style='color:black;'>" + convertToDateString(value.date) + "</p>" +
                            "</div>" +
                            "<div class='transaction-card-shop'>" +
                                "<p class='x-large' style='color:black;'><b>" + value.shop + "</b><p>" +
                            "</div>" +
                            "<div class='transaction-card-category transaction-card-last-row'>" +
                                "<p style='color:black;'>" + value.category + "</p>" +
                            "</div>" +
                            "<div class='transaction-card-amount' style='text-align:right;'>" +
                                "<p class='x-large' style='color:black; display:inline;'>" +
                                    splitAtComma(value.sumAmount)[0] +
                                "</p>" +
                                "<p style='color:black; display:inline;'>" +
                                    splitAtComma(value.sumAmount)[1] +
                                "</p>" +
                            "</div>" +
                        "</div>" +
                    "</a>";

                $(".transaction-card-conatainer").append(card);
                }

            )
        }
    })
});
