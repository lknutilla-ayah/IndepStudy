/*----LOCK FUNCTIONS----*/

function lock(lock_btn){
    var student = classlist[getClasslistIndex(lock_btn.parentNode.id)];
    if (student.locked) { //does use unlockThis: not based on menu locks
        student.locked = false;
        $(lock_btn.parentNode).removeClass("ui-state-disabled");
        lock_btn.style.backgroundColor = "white";
    }
    else lockThis(lock_btn.parentNode, lock_btn);
};

$('#lock_fems').click(function() {
    if ($('#gender').prop("checked"))
    {
        var female_list = classlist.filter(function(obj)
            {return obj.gender === "F"});
        for (var i = 0; i < female_list.length; ++i)
        {
            var student_li = document.getElementById(female_list[i].id); 
            var lock_btn = document.getElementById("lock_" + female_list[i].id); 
            $(student_li).addClass("female");
            if ($('#lock_fems').prop("checked")) lockThis(student_li, lock_btn);
            else unlockThis(student_li, lock_btn);
        }
    }
});

$('#lock_pres').click(function() {
    for (var i = 0; i < grouplist.length; ++i)
    {
        var presenter = classlist.map(function(obj)
            {return obj.id}).indexOf(grouplist[i].presenter);
        presenter = classlist[presenter];

        var student_li = document.getElementById(presenter.id); 
        var lock_btn = document.getElementById("lock_" + presenter.id);
        if (presenter.group != grouplist[i].id)
        {
            $(student_li).addClass("pres_danger");
            continue;
        }
        if ($('#lock_pres').prop("checked")) 
        {
            $(student_li).removeClass("pres_danger");
            lockThis(student_li, lock_btn);
        }
        else
        {
            $(student_li).removeClass("pres_danger");
            unlockThis(student_li, lock_btn);
        }
    }
});

$('#lock_prefs').click(function() {
    if ($('#lead_pref').prop("checked"))
    {
        for (var i = 0; i < grouplist.length; ++i)
        {
            for (var j = 0; j < grouplist[i].preferred.length; ++j)
            {
                var student = classlist[getClasslistIndex(grouplist[i].preferred[j])];
                if (student.group === grouplist[i].id)
                {
                    var student_li = document.getElementById(student.id);
                    var lock_btn = document.getElementById("lock_" + student.id);
                    if ($('#lock_prefs').prop("checked")) lockThis(student_li, lock_btn);
                    else unlockThis(student_li, lock_btn);
                }
            }
        }
    }
});

function lockThis(student_li, lock) {
    var student = classlist[getClasslistIndex(student_li.id)];
    if (student.group === "sortable_class") return;
    student.locked = true;
    if (!$(student_li).hasClass("ui-state-disabled")) {
        $(student_li).addClass("ui-state-disabled");
        lock.style.backgroundColor = "#666666";
    }
}

function unlockThis(student, lock) {
    if (crosscheckLock(student)) {
        classlist[getClasslistIndex(student.id)].locked = false;
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
            if ($.inArray( student.id, group.preferred) != -1) return false;
        }
    }
    return true;
}

function checkLocks(student) {
    var student_li = document.getElementById(student.id);
    var lock_btn = document.getElementById("lock_" + student.id);
    if ($('#lock_fems').prop("checked")) {
        if (student.gender === "F") lockThis(student_li, lock_btn);
    }
    if ($('#lock_pres').prop("checked")) {
        if (student.presenter === student.group) lockThis(student_li, lock_btn);
    }
    if ($('#lock_prefs').prop("checked")){
        if (student.group === "sortable_class") return;
        var group = grouplist[getGrouplistIndex(student.group)];
        if ($.inArray( student.id, group.preferred) != -1) lockThis(student_li, lock_btn);
    }
}
