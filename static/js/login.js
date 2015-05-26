$('#login').click(function() {
    var username = $('#enter_username').val();
    var password = $('#enter_password').val();
    $.ajax({
        url: '/', // Location of the service
        type: 'POST', //GET or POST or PUT or DELETE verb
        data: JSON.stringify({username: username, password: password}), //Data sent to server
        contentType: 'application/json',
        processdata: true, //True or False
        crossDomain: true,
        success: function(data) {
         window.location = data;
        }
    });
});
