/*----LOCK FUNCTIONS----*/

$('.lock').click(function() {
    var student = this.parentNode;
    if (!$(student).hasClass("ui-state-disabled")) lockThis(student,this);
    else unlockThis(student, this);
});

$('#lock_fem').click(function() {
    var students = document.getElementsByClassName("student");
    var f_lst = []; //list of female students
    for (var i = 0; i < students.length; ++i)
    {
        var gender = document.getElementById("gender_" + students[i].id).innerHTML;
        if (gender === "F") f_lst[f_lst.length] = students[i];
    }
    for (var j = f_lst.length-1; j>=0; --j)
    {
        var lock = document.getElementById("lock_"+f_lst[j].id);
        lockThis(f_lst[j],lock);
    }
    lock_fems = true;
});
$('#unlock_fem').click(function() {
    lock_fems = false;
    var students = document.getElementsByClassName("student");
    var f_lst = []; //list of female students
    for (var i = 0; i < students.length; ++i)
    {
        var gender = document.getElementById("gender_" + students[i].id).innerHTML;
        if (gender === "F") f_lst[f_lst.length] = students[i];
    }
    for (var j = f_lst.length-1; j>=0; --j)
    {
        var lock = document.getElementById("lock_"+f_lst[j].id);
        unlockThis(f_lst[j],lock);
    }
});

$('#lock_pres').click(function() {
    var students = document.getElementsByClassName("student");
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < students.length; ++i)
    {
        for (var j = 0; j < doc_groups.length; ++j)
        {
            var pres_lead = document.getElementById("glead_"+doc_groups[j].id).innerHTML;
            var lead_spot = students[i].parentNode.id;
            if (students[i].id === pres_lead) {
                if (lead_spot === doc_groups[j].id) {
                    var lock = document.getElementById("lock_"+students[i].id);
                    changeColor(students[i]);
                    students[i].style.backgroundColor = "white";
                    lockThis(students[i],lock);
                }
                else {
                    students[i].style.backgroundColor = "#D0A1A1";
                }
            }
        }
    }
    lock_pres = true;
});

$('#unlock_pres').click(function() {
    lock_pres = false;
    var students = document.getElementsByClassName("student");
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < students.length; ++i)
    {
        for (var j = 0; j < doc_groups.length; ++j)
        {
            var pres_lead = document.getElementById("glead_"+doc_groups[j].id).innerHTML;
            var lead_spot = students[i].parentNode.id;
            if (students[i].id === pres_lead) {
                if (lead_spot === doc_groups[j].id) {
                    var lock = document.getElementById("lock_"+students[i].id);
                    unlockThis(students[i],lock);
                }
                changeColor(students[i]);
            }
        }
    }
});

$('#lock_prefs').click(function() {
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < doc_groups.length; ++i)
    {
        var prefs = document.getElementById("prefs_"+doc_groups[i].id).value;
        var students = $(doc_groups[i]).children('li');
        prefs = prefs.split(",");
        for (var j = 0; j < students.length; ++j)
        {
            if (prefs.indexOf(students[j].id) != -1) {
                var lock = document.getElementById("lock_"+students[j].id);
                lockThis(students[j],lock);
            }
        }
    }
    lock_prefs = true;
});
$('#unlock_prefs').click(function() {
    lock_prefs = false;
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < doc_groups.length; ++i)
    {
        var prefs = document.getElementById("prefs_"+doc_groups[i].id).value;
        var students = $(doc_groups[i]).children('li');
        prefs = prefs.split(",");
        for (var j = 0; j < students.length; ++j)
        {
            if (prefs.indexOf(students[j].id) != -1) {
                var lock = document.getElementById("lock_"+students[j].id);
                unlockThis(students[j],lock);
            }
        }
    }
});

function lockThis(student, lock) {
    if (!$(student).hasClass("ui-state-disabled")) {
        $(student).addClass("ui-state-disabled");
        lock.style.backgroundColor = "#666666";
    }
}

function unlockThis(student, lock) {
    if (crosscheckLock(student)) {
        $(student).removeClass("ui-state-disabled");
        lock.style.backgroundColor = "white";
    }
}

function crosscheckLock(student) {
    if ($(student).hasClass("ui-state-disabled")) {
        if (set_gender) {
            var gender = document.getElementById("gender_" + student.id).innerHTML;
            if (gender == "F" && lock_fems) {
                return false;
            }
        }
        if (lock_pres) {
            var doc_groups = document.getElementsByClassName("group_mems");
            var lead_spot = student.parentNode.id;
            for (var j = 0; j < doc_groups.length; ++j)
            {
                var pres_lead = document.getElementById("glead_"+doc_groups[j].id).innerHTML;
                if (student.id === pres_lead && lead_spot === doc_groups[j].id) return false;
            } 
        }
        if (lock_prefs){
            var doc_groups = document.getElementsByClassName("group_mems");
            for (var i = 0; i < doc_groups.length; ++i)
            {
                var prefs = document.getElementById("prefs_"+doc_groups[i].id).value;
                if (prefs.indexOf(student.id) != -1) {
                    console.log(student.id);
                    return false;
                }
            }
        }
    }
    return true;
}
