$(document).ready( function() {
    var now = new Date();
    var plus_three = new Date();
    plus_three.setDate(plus_three.getDate()+3);
    now = formatDate(now);
    plus_three = formatDate(plus_three);

    document.getElementById("startDate").value = now;
    document.getElementById("endDate").value = plus_three;
})

function presetEndDate() {
    var plus_three = document.getElementById("startDate").value;
    plus_three = plus_three.split("-");
    plus_three = new Date(plus_three[0], (plus_three[1] - 1) , plus_three[2]);
    plus_three.setDate(plus_three.getDate()+3);
    plus_three = formatDate(plus_three);
    document.getElementById("endDate").value = plus_three;
};

function formatDate(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var today = date.getFullYear()+"-"+(month)+"-"+(day) ;
    return today;
};


