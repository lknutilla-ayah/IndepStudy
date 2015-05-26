$(document).ready( function() {

    for (var i = 0; i < get_classlist.length; ++i)
    {
        console.log(get_classlist[i]);
    }
    for (var i = 0; i < get_grouplist.length; ++i)
    {
        console.log(get_grouplist[i]);
    }
})


function sendDataToServer() {
  $.ajax({
        url: '/sortinghat', // Location of the service
        type: 'POST', //GET or POST or PUT or DELETE verb
        data: JSON.stringify({classlist: classlist, grouplist: grouplist}), //Data sent to server
        contentType: 'application/json',
        processdata: true, //True or False
        crossDomain: true,
        error: ServiceFailed  // When Service call fails
    });
}

function ServiceFailed(result) {
  console.log("fail");
  Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}
