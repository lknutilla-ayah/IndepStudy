$('#login').click(function() {
    var pass_entry = document.getElementById("enter_password").innerHTML;
    if (pass_entry === password)
    {
        //Go link to something
    }
    else
    {
        pass_entry = "";
        $('#pass_form').addClass("has-error");
        document.getElementById("incorrect").style.color = 'red';
        document.getElementById("incorrect").innerHTML = "Password incorrect";
    }
}
