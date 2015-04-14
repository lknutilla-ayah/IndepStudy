//global variables
    var group_max, group_min;
    var nd_chk, rd_chk;//sort from 2nd choices, sort from 3rd choices
    var lock_fems = false, lock_pres = false, lock_prefs = false;

$(document).ready( function() {
    $( "ul.droptrue" ).sortable({
        connectWith: "ul",
        cancel: ".ui-state-disabled",
        update: function(event, ui) {
            if (ui.sender != null)
            {
                var old_grp = document.getElementById(ui.sender.attr('id'));
                var new_grp = document.getElementById(ui.item.parent().attr('id'));
                var student = document.getElementById(ui.item.attr('id'));
                if (old_grp.id != "sortable_class") updateCount(old_grp);
                if (new_grp.id != "sortable_class") updateCount(new_grp);
                changeColor(student);
            }
        }
    });
    $( "#sortable_class" ).disableSelection();

    $("#grp_range").ionRangeSlider({
        type: "double",
        min: 0,
        max: 7,
        from: 3,
        to: 5,
        onStart: function (data) {
            group_min = data.from;
            group_max = data.to;
        },
        onChange: function (data) {
            group_min = data.from;
            group_max = data.to;
        }
    });
    nd_chk = document.getElementById("2nd");
    rd_chk = document.getElementById("3rd");
})


/*----CLASS LIST FUNCTIONS----*/

$( "#sort_frst" ).click(function() {
    //var students = document.getElementsByClassName("student");
    var students = $("#sortable_class").children('li');
    for (var i = students.length-1; i>=0; --i)
    {
        if ($(students[i]).hasClass("ui-state-disabled")) continue;
        addStudentFromList(students[i]);
    }
});
$( "#srt_rand" ).click(function() {
    var students = document.getElementsByClassName("student");
    students = [].slice.call(students,0);
    var doc_groups = document.getElementsByClassName("group_mems");
    var srt_class = document.getElementById("sortable_class");
    var num_students = students.length;
    var min = group_min;
    //clear group counts
    for (var i = 0; i < doc_groups.length; ++i)
    {
        var members = $(doc_groups[i]).children('li');
        for (var j = members.length-1; j >= 0; --j) 
        {
            addMember(members[j],srt_class,doc_groups[i]);
        }
    }
    while (num_students > 0 && min <= group_max) {
        for (var i = 0; i < doc_groups.length; ++i)
        {
            var grp_sz = document.getElementById("gcount_"+doc_groups[i].id).value;
            while (grp_sz < min && num_students > 0) 
            {
                var rand_student = Math.floor(Math.random() * (num_students - 0));
                var student = students[rand_student];
                addMember(student, doc_groups[i], srt_class);
                students.splice(rand_student,1);
                grp_sz = document.getElementById("gcount_"+doc_groups[i].id).value;
                --num_students;
            }   
        }
        ++min;
    }
});

$( "#srt_non" ).click(function() {
    var srt_class = document.getElementById("sortable_class");
    var doc_groups = document.getElementsByClassName("group_mems");
    var min = group_min;
    var max = group_max;
    var no_pref_cnt = $("#sortable_class").children('li').length;
    while (no_pref_cnt > 0 && min <= max) {
        var no_pref = $("#sortable_class").children('li');
        for (var i = no_pref.length-1; i >= 0; --i) 
        {
            for (var j = 0; j < doc_groups.length; ++j)
            {
                var grp_sz = document.getElementById("gcount_"+doc_groups[j].id).value;
                if (grp_sz < min) {
                    addMember(no_pref[i], doc_groups[j], srt_class);
                    --no_pref_cnt;
                    break;
                }
            }
        }
        ++min;
    }
    if (no_pref_cnt > 0) {
        alert("Group size must be increased in order to sort all students");
    }    
});

$( "#srt_fem" ).click(function() {
    var students = document.getElementsByClassName("student");
    //var num_fem = document.getElementById("num_fem").value;
    var f_lst = []; //list of female students
    for (var i = 0; i < students.length; ++i)
    {
        var gender = document.getElementById("gender_" + students[i].id).innerHTML;
        if (gender === "F") f_lst[f_lst.length] = students[i];
    }
    for (var j = f_lst.length-1; j>=0; --j)
    {
        if ($(f_lst[j]).hasClass("ui-state-disabled")) continue;
        addStudentFromList(f_lst[j]);
    }
});

function addStudentFromList(student) {
    var first = document.getElementById("first_" + student.id).innerHTML;
    var second = document.getElementById("second_" + student.id).innerHTML;
    var third = document.getElementById("third_" + student.id).innerHTML;
    if (set_gender) var gender = document.getElementById("gender_" + student.id).innerHTML;
    var top_choice;
    // if (set_gender && gender === "F") student.style.backgroundColor = "#FFE5FF";
    // else student.style.backgroundColor = "white";

    if (document.getElementById(first)) top_choice = first;
    else if (document.getElementById(second)) top_choice = second;
    else if (document.getElementById(third)) top_choice = third;
    else return;//leave in class list 
    //var li_stud = document.getElementById(student.id);
    var ul_group = document.getElementById(top_choice);
    //ul_group.appendChild(li_stud);
    ul_group.appendChild(student);
    changeColor(student);
    updateCount(ul_group);
}

/*----GROUP SORT FUNCTIONS----*/

$( "#ordr_scr" ).click(function() {
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < doc_groups.length; ++i)
    {
        var group = doc_groups[i];
        var members = [];
        $(group).find('li').each(function(){
            members[members.length] = this;
        });
        members.sort(function(a, b) {
            //a.id = student name
            a = parseInt(document.getElementById("score_" + a.id).innerHTML);
            b = parseInt(document.getElementById("score_" + b.id).innerHTML);
            return a > b;
        })
        for (var j = 0; j < members.length; ++j)
        {
            var score = document.getElementById("score_" + members[j].id).innerHTML;
            group.appendChild(members[j]);
        }
    }
});

$( ".delete_grp" ).click(function() {
    var group = this.id;
    group = group.replace('d_','');
    var members = [];
    group = document.getElementById(group);
    $(group).find('li').each(function(){
        members[members.length] = this;
    });
    var class_lst = document.getElementById("sortable_class");
    for (var i = 0; i < members.length; ++i)
    {
        members[i].style.backgroundColor = "white";
        class_lst.appendChild(members[i]);
    }
    var group_obj = document.getElementById("obj_" + group.id);
    group_obj.parentNode.removeChild(group_obj);
});

$( ".remove_mem" ).click(function() {
    var group = this.id;
    group = group.replace('r_','');
    var members = [];
    group = document.getElementById(group);
    $(group).find('li').each(function(){
        members[members.length] = this;
    });
    for (var i = 0; i < members.length; ++i)
    {
        if (members.length <= group_min) {
            alert("Group " + group.id + " is smaller than the min group size ("+ group_min +")");
            break;
        }
        if ($(members[i]).hasClass("ui-state-disabled")) continue;
        var first = document.getElementById("first_" + members[i].id).innerHTML;
        var second = document.getElementById("second_" + members[i].id).innerHTML;
        var third = document.getElementById("third_" + members[i].id).innerHTML;
        if (document.getElementById("gcount_"+first) && 
            document.getElementById("gcount_"+first).value < group_max && 
            first != group.id) {
            first = document.getElementById(first);
            //members[i].style.backgroundColor = "white";
            addMember(members[i], first, group);
            return;
        }
        else if (document.getElementById("gcount_"+second) && 
            document.getElementById("gcount_"+second).value < group_max && 
            nd_chk.checked && second != group.id) {
            second = document.getElementById(second);
            //members[i].style.backgroundColor = "#D6E0FF";
            addMember(members[i], second, group);
            return;
        }
        else if (document.getElementById("gcount_"+third) &&
            document.getElementById("gcount_"+third).value < group_max && 
            rd_chk.checked && third != group.id) {
            third = document.getElementById(third);
            //members[i].style.backgroundColor = "#FFFFC2";
            addMember(members[i], third, group);
            return;
        }
    }
});

$( ".add_mem" ).click(function() {
    var group = this.id;
    var members;
    group = group.replace('a_','');
    group = document.getElementById(group);
    if ($(group).children('li').length >= group_max) {
        alert("Group " + group.id + " is already over the max group size (" + group_max + ")");
        return;
    }
    var doc_groups = document.getElementsByClassName("group_mems");
    for (var i = 0; i < doc_groups.length; ++i)
    {
        if (doc_groups[i].id === group.id) continue;
        //members = [];
        members = $(doc_groups[i]).children('li');
        // $(doc_groups[i]).find('li').each(function(){
        //     members[members.length] = this;
        // });
        for (var j = 0; j < members.length; ++j) //members[i] is student
        {
            if (members.length <= group_min) break;
            if ($(members[j]).hasClass("ui-state-disabled")) continue;
            var first = document.getElementById("first_" + members[j].id).innerHTML;
            var second = document.getElementById("second_" + members[j].id).innerHTML;
            var third = document.getElementById("third_" + members[j].id).innerHTML;
            if (first === group.id) {
                first = document.getElementById(first);
                addMember(members[j], first, doc_groups[i]);
                return;
            }
            else if (second === group.id && nd_chk.checked) {
                second = document.getElementById(second);//ul
                addMember(members[j], second, doc_groups[i]);
                return;
            }
            else if (third === group.id && rd_chk.checked) {
                third = document.getElementById(third);//ul
                addMember(members[j], third, doc_groups[i]);
                return;
            }
        }
    }
    alert("No students would prefer to/ or are able to switch into " + group.id );  
});

function addMember(student, new_grp, old_grp) {
    new_grp.appendChild(student);
    if (old_grp.id != "sortable_class") updateCount(old_grp);
    if (new_grp.id != "sortable_class") updateCount(new_grp);
    changeColor(student);
}

/*----HELPER FUNCTIONS----*/

function updateCount(group) {
    document.getElementById("gcount_"+group.id).value = $(group).children('li').length;
}

function changeColor(student) {
    var group = student.parentNode.id;
    var first = document.getElementById("first_" + student.id);
    var second = document.getElementById("second_" + student.id);
    var third = document.getElementById("third_" + student.id);
    if (set_gender) var gender = document.getElementById("gender_" + student.id).innerHTML;
    if (set_gender && gender == "F") {
        student.style.backgroundColor = "#FFF2FF";
    }
    if (first.innerHTML === group) {
        first.style.color = "#00CC99";
        second.style.color = "black";
        third.style.color = "black";
    }
    else if (second.innerHTML === group) {
        second.style.color = "#FFC266";
        first.style.color = "black";
        third.style.color = "black";
    }
    else if (third.innerHTML === group) {
        third.style.color = "#A30000";
        second.style.color = "black";
        first.style.color = "black";
    }
    else {
        first.style.color = "black";
        second.style.color = "black";
        third.style.color = "black";
    }
}
