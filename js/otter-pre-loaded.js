$(document).ready(function(){
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('mode') === 'edit' || searchParams.get('mode') === 'create') {
        window.MODE = searchParams.get('mode');
    } else {
        window.MODE = null;
    }
    if (window.MODE === 'edit') {
        if (searchParams.has('id')) {
            window.TRANSACTION_ID = parseInt(searchParams.get('id'));
        } else {
            window.TRANSACTION_ID  = undefined;
            M.toast({html: "Ooops! You're in edit mode, but no transaction id is supplied!"});
            throw new Error("MODE is 'edit' but no id is supplied as url parameter.");
        }
    }
});