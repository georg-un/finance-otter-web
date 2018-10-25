/* EDITOR FUNCTIONS */

// if mode == edit, load payment and put current values into inputs
$(window).on('load', function() {
    if (window.MODE === 'edit') {
        let target = 'http://localhost:8080/api/v1/payments/'.concat(window.TRANSACTION_ID);
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: target,
            success: function (payment) {
                console.log(payment);

                $('#amount').val( currency(payment.sumAmount) );
                $('#shop').val( payment.shop );
                $('#description').val( payment.description );
                $('#category').val( payment.category );
                $('#date').val( new Date(payment.date).toISOString().split('T')[0] );
                $('#custom-distribution').prop('checked', true);
                for (i=0; i < payment.debits.length; i++) {
                    $('#' + payment.debits[i].debtorId).val(
                        currency(payment.debits[i].amount)
                    );
                }

            }
        });
    }
});

// if mode == edit, X-button must link back to payment, else it must link to transactions
xButton = function() {
    if (window.MODE === 'edit') {
        window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/payment.html?id=".concat(window.TRANSACTION_ID));  // TODO: switch to hostname global
    } else {
        window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/transactions.html");  // TODO: switch to hostname global
    }
};


$(document).ready(function() {
    $('#distribute').click(function() {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: 'http://localhost:8080/api/v1/user',
            success: function (data) {
                distributeOnEmptyFields(data);
            }
        });
    });
});

$(document).ready(function() {
    $('#submit').click(function () {
        $.ajax({
            type: 'GET',
            dataType: "json",
            url: 'http://localhost:8080/api/v1/user',
            success: function (data) {
                // make sure distribution is set and valid
                let emptyFields;
                let checkboxValue = document.getElementById('custom-distribution').checked;
                if (checkboxValue === false) {
                    emptyFields = distributeOnEmptyFieldsBeforeSubmit(data);
                } else if (checkboxValue === true && getFilledOutAmountAndEmptyFields(getUserIds(data)).emptyFields.length > 0) {
                    distributeOnEmptyFields(data);
                }
                // create debits
                let debits = [];
                if (checkboxValue === true) {
                    let debitFields = document.getElementsByClassName('debit-input');
                    for (i = 0; i < debitFields.length; i++) {
                        debits[i] = {
                            "debtorId": parseInt(debitFields[i].id),
                            "amount": currency(parseFloat(debitFields[i].value)).value
                        }
                    }
                } else if (checkboxValue === false) {
                    for (i = 0; i < emptyFields.length; i++) {
                        debits[i] = {
                            "debtorId": parseInt(emptyFields[i].fieldId),
                            "amount": currency(parseFloat(emptyFields[i].assignedValue)).value
                        }
                    }
                }

                // create payload
                let payload = {};
                payload.userId = 1;  // TODO: get userId from session
                payload.date = document.getElementById('date').value;
                payload.category = document.getElementById('category').value;
                payload.shop = document.getElementById('shop').value;
                payload.description = document.getElementById('description').value;
                payload.billId = null;
                payload.debits = debits;

                if (MODE === 'create') {
                    $.ajax({
                        type: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: "json",
                        url: 'http://localhost:8080/api/v1/payments',
                        data: JSON.stringify(payload),
                        success: function (data) {
                            window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/payment.html?id=".concat(data.transactionId));  // TODO: switch to hostname global
                        }
                    });
                } else if (MODE === 'edit') {
                    payload.transactionId = window.TRANSACTION_ID;
                    $.ajax({
                        type: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        dataType: "json",
                        url: 'http://localhost:8080/api/v1/payments',
                        data: JSON.stringify(payload),
                        success: function (data) {
                            window.location.replace("/media/Daten-Partition/Repositories/accounting_otter_webapp/payment.html?id=".concat(data.transactionId));  // TODO: switch to hostname global
                        }
                    });
                } else {
                    M.toast({html: 'Ooops! Something went wrong. Please reload the page!'});
                    throw new Error("MODE was neither 'create' nor 'edit'.");
                }
            }
        });
    });
});


distributeOnEmptyFields = function(users) {
    // get user ids
    let userIds = getUserIds(users);

    // get total amount
    let totalAmount = getTotalAmount();

    // get amount of filled inputs
    let tmpValue = getFilledOutAmountAndEmptyFields(userIds);
    let filledOutAmount = tmpValue.filledOutAmount;
    let emptyFields = tmpValue.emptyFields;

    if (filledOutAmount.value >= currency(totalAmount).value) {
        M.toast({html: 'Sum of fields must be smaller than total amount!'});
        throw new Error("Sum of input-fields of class 'debit-input' is larger than value of 'amount'.")
    }
    if (emptyFields.length <= 0) {
        M.toast({html: 'Please leave at least one field empty!'});
        throw new Error("All input-fields of class 'debit-input' have a value assigned.")
    }

    // distribute amount on empty fields
    emptyFields = distributeValuesByBresenhamAlgorithm(totalAmount, filledOutAmount, emptyFields);

    // make sure that values add up to total
    validateDistribution(totalAmount, filledOutAmount, emptyFields);

    // set values of empty fields
    for (i=0; i < emptyFields.length; i++) {
        document.getElementById(emptyFields[i].fieldId).value = emptyFields[i].assignedValue.value;
    }
};

distributeOnEmptyFieldsBeforeSubmit = function(users) {
    // get user ids
    let userIds = getUserIds(users);

    // get total amount
    let totalAmount = getTotalAmount();

    // get amount of filled inputs
    let tmpValue = getFilledOutAmountAndEmptyFields(userIds);
    let filledOutAmount = tmpValue.filledOutAmount;
    let emptyFields = tmpValue.emptyFields;

    // distribute amount on empty fields
    emptyFields = distributeValuesByBresenhamAlgorithm(totalAmount, filledOutAmount, emptyFields);

    // make sure that values add up to total
    validateDistribution(totalAmount, filledOutAmount, emptyFields);

    return emptyFields;
};

getUserIds = function(users) {
    let userIds= [];
    for (i=0; i < users.length; i++) {
        userIds.push(users[i]["userId"]);
    }
    return userIds;
};

getTotalAmount = function() {
    let totalAmount = document.getElementById('amount').value;
    if (totalAmount === "" || totalAmount == null) {
        M.toast({html: 'Please insert first the total amount!'});
        throw new Error("Value of input-field with id 'amount' is empty.");
    }
    return currency(totalAmount);
};

getFilledOutAmountAndEmptyFields = function(userIds) {
    let filledOutAmount = currency(0);
    let emptyFields = [];

    let tmpFieldValue;
    for (i=0; i < userIds.length; i++) {
        tmpFieldValue = document.getElementById(userIds[i]).value;
        if (tmpFieldValue != null && tmpFieldValue !== "") {
            if (parseFloat(tmpFieldValue) < 0) {
                M.toast({html: 'Please insert only positive numbers!'});
                throw new Error("Number in input-field of class 'debit-input' is negative.")
            }
            filledOutAmount = filledOutAmount.add(parseFloat(document.getElementById(userIds[i]).value));
        } else {
            emptyFields.push({
                "fieldId" : userIds[i],
                "assignedValue" : currency(0)});
        }
    }
    return {
        "filledOutAmount" : filledOutAmount,
        "emptyFields" : emptyFields
    }
};

distributeValuesByBresenhamAlgorithm = function(totalAmount, filledOutAmount, emptyFields) {
    // get difference
    let difference = totalAmount.subtract(filledOutAmount);

    // divide difference by number of empty fields
    let fieldValue = difference.value / emptyFields.length;
    fieldValue = currency(Math.floor(fieldValue * 100) / 100);  // make sure values are rounded down

    // get remainder
    let remainder = difference.subtract(currency(fieldValue).multiply(emptyFields.length));

    // distribute fieldValue on empty fields
    for (i=0; i < emptyFields.length; i++) {
        emptyFields[i].assignedValue = emptyFields[i].assignedValue.add(fieldValue);
    }

    // distribute remainder on empty fields
    for (i=0; i < (remainder.multiply(100)); i++) {
        emptyFields[i].assignedValue = emptyFields[i].assignedValue.add(0.01);
    }
    return emptyFields;
};

validateDistribution = function(totalAmount, filledOutAmount, emptyFields) {
    let checkEmptyFieldValues = currency(0);
    for (i=0; i < emptyFields.length; i++) {
        checkEmptyFieldValues = checkEmptyFieldValues.add(emptyFields[i].assignedValue);
    }
    if (checkEmptyFieldValues.add(filledOutAmount) != totalAmount.value) {
        M.toast({html: 'Ooops! Something went wrong...'});
        throw new Error("Sum of values from filled out debit fields and values to be assigned to empty debit fields does not match with value from total amount");
    }
};

/* STYLE */

document.getElementById('date').valueAsDate = new Date();

splitAtComma = function(int) {
    return int.toFixed(2).toString().split('.');
};

removeValues = function() {
    let fields = document.getElementsByClassName("debit-input");
    for(i=0; i < fields.length; i++) {
        fields[i].value = "";
    }
};

convertToDateString = function(timestamp) {
    let date = new Date(timestamp).toISOString().split('T');
    date = date[0].split('-');
    return date[2] + '.' + date[1] + '.' + date[0];
};