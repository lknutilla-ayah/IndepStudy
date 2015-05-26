/*----LOCK FUNCTIONS----*/

function lock(lock_btn){
    var student = classlist[getClasslistIndex(lock_btn.parentNode.id)];
    if (student.locked) {
        student.locked = false;
        unlockThis(lock_btn.parentNode, lock_btn);
    }
    else
    {
        student.locked = true;
        lockThis(lock_btn.parentNode, lock_btn);
    }
};

$('#lock_fems').click(function() {
    var female_list = classlist.filter(function(obj)
        {return obj.gender === "F"});
    for (var i = 0; i < female_list.length; ++i)
    {
        var student_li = document.getElementById(female_list[i].id); 
        var lock_btn = document.getElementById("lock_" + female_list[i].id); 
        if ($('#lock_fems').prop("checked")) 
        {
            female_list[i].locked = true;
            lockThis(student_li, lock_btn);
        }
        else
        {
            female_list[i].locked = false;
            unlockThis(student_li, lock_btn);
        }  
    }
});

$('#lock_pres').click(function() {

    for (var i = 0; i < grouplist.length; ++i)
    {
        for (var j = 0; j < grouplist[i].preferred.length; ++j)
        {
            
        }
    }
    // var students = document.getElementsByClassName("student");
    // var doc_groups = document.getElementsByClassName("group_mems");
    // for (var i = 0; i < students.length; ++i)
    // {
    //     for (var j = 0; j < doc_groups.length; ++j)
    //     {
    //         var pres_lead = document.getElementById("glead_"+doc_groups[j].id).innerHTML;
    //         var lead_spot = students[i].parentNode.id;
    //         if (students[i].id === pres_lead) {
    //             if (lead_spot === doc_groups[j].id) {
    //                 var lock = document.getElementById("lock_"+students[i].id);
    //                 changeColor(students[i]);
    //                 students[i].style.backgroundColor = "white";
    //                 lockThis(students[i],lock);
    //             }
    //             else {
    //                 students[i].style.backgroundColor = "#D0A1A1";
    //             }
    //         }
    //     }
    // }
    // lock_pres = true;
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
    student = classlist[getClasslistIndex(student.id)];
    if (student.locked) {
        if ($('#lock_fems').prop("checked")) {
            if (student.gender === "F") return false;
        }
        if ($('#lock_pres').prop("checked")) {
            if (student.presenter === student.group) return false;
        }
        if ($('#lock_prefs').prop("checked")){
            var group = grouplist[getGrouplistIndex(student.group)];
            if ($.inArray( student.id, group.preferred)) return false;
        }
    }
    return true;
}
