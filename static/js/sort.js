//global variables
    var group_max, group_min;
    var nd_chk, rd_chk;//sort from 2nd choices, sort from 3rd choices

$(document).ready( function() {
    $( "ul.droptrue" ).sortable({
      connectWith: "ul"
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

$( "#sort_frst" ).click(function() {
    var students = document.getElementsByClassName("student");
    for (var i = students.length-1; i>=0; --i)
    {
        var first = document.getElementById("first_" + students[i].id).innerHTML;
        var second = document.getElementById("second_" + students[i].id).innerHTML;
        var third = document.getElementById("third_" + students[i].id).innerHTML;
        var top_choice;
        if (document.getElementById(first)) {
            students[i].style.backgroundColor = "white";
            top_choice = first;
        }
        else if (document.getElementById(second)) {
            students[i].style.backgroundColor = "#D6E0FF";
            top_choice = second;
        }
        else if (document.getElementById(third)) {
            students[i].style.backgroundColor = "#FFE0C2";
            top_choice = third;
        }
        else //move into unknown/later placables/unsorted bucket 
        {}
        var li_stud = document.getElementById(students[i].id);
        var ul_group = document.getElementById(top_choice);
        ul_group.appendChild(li_stud);
        updateCount(ul_group);
    }
});

$( "#srt_fem" ).click(function() {
    var students = document.getElementsByClassName("student");
    var num_fem = document.getElementById(num_fem).value;
    for (var i = students.length-1; i>=0; --i)
    {
        var gender = document.getElementById("gender_" + student.id).innerHTML;
        if (gender === "F") //need to format F/M
        {
            
        }
    }
});

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
        console.log(group.id);
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
        var first = document.getElementById("first_" + members[i].id).innerHTML;
        var second = document.getElementById("second_" + members[i].id).innerHTML;
        var third = document.getElementById("third_" + members[i].id).innerHTML;
        if (document.getElementById("gcount_"+first).value < group_max && 
            first != group.id) {
            first = document.getElementById(first);
            members[i].style.backgroundColor = "white";
            addMember(members[i], first, group);
            return;
        }
        else if (document.getElementById("gcount_"+second).value < group_max && 
            nd_chk.checked && second != group.id) {
            second = document.getElementById(second);
            members[i].style.backgroundColor = "#D6E0FF";
            addMember(members[i], second, group);
            return;
        }
        else if (document.getElementById("gcount_"+third).value < group_max && 
            rd_chk.checked && third != group.id) {
            third = document.getElementById(third);
            members[i].style.backgroundColor = "#FFE0C2";
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
        members = [];
        $(doc_groups[i]).find('li').each(function(){
            members[members.length] = this;
        });
        for (var j = 0; j < members.length; ++j) //members[i] is student
        {
            if (members.length <= group_min) break;
            var first = document.getElementById("first_" + members[j].id).innerHTML;
            var second = document.getElementById("second_" + members[j].id).innerHTML;
            var third = document.getElementById("third_" + members[j].id).innerHTML;
            if (first === group.id) {
                first = document.getElementById(first);
                members[j].style.backgroundColor = "white";
                addMember(members[j], first, doc_groups[i]);
                return;
            }
            else if (second === group.id && nd_chk.checked) {
                second = document.getElementById(second);//ul
                members[j].style.backgroundColor = "#D6E0FF";
                addMember(members[j], second, doc_groups[i]);
                return;
            }
            else if (third === group.id && rd_chk.checked) {
                third = document.getElementById(third);//ul
                members[j].style.backgroundColor = "#FFE0C2";
                addMember(members[j], third, doc_groups[i]);
                return;
            }
        }
    }
    alert("No students would prefer to/ or are able to switch into " + group.id );  
});

function addMember(student, new_grp, old_grp) {
    new_grp.appendChild(student);
    updateCount(new_grp);
    updateCount(old_grp);
}

function updateCount(group) {
    document.getElementById("gcount_"+group.id).value = $(group).children('li').length;
}


    // var doc_groups = document.getElementsByClassName("group_mems");
    // for (var i = 0; i < doc_groups.length; ++i)
    // {
    //     var name = document.getElementById("gname_" + doc_groups[i].id).innerHTML;
    //     var lead = document.getElementById("glead_" + doc_groups[i].id).innerHTML;
    //     var id = doc_groups[i].id;
    //     groups[doc_groups[i].id] = new Group(name, lead, id);
    // }
    // for (var i = 0; i < students.length; ++i)
    // {
    //     var name = document.getElementById("name_" + students[i].id).innerHTML;
    //     var gender = document.getElementById("gender_" + students[i].id).innerHTML;
    //     var score = document.getElementById("score_" + students[i].id).innerHTML;
    //     var first = document.getElementById("first_" + students[i].id).innerHTML;
    //     var second = document.getElementById("second_" + students[i].id).innerHTML;
    //     var third = document.getElementById("third_" + students[i].id).innerHTML;
    //     var student = new Student(name,gender,score,first,second,third);
    //     var li_stud = document.getElementById(students[i].id);
    //     var ul_group = document.getElementById(first);
    //     ul_group.appendChild(li_stud);
    // }
