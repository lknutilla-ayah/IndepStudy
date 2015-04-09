$(document).ready( function() {
    $( "ul.droptrue" ).sortable({
      connectWith: "ul"
    });
    $( "#sortable_class" ).disableSelection();
})

$( "#sort_frst" ).click(function() {
    var students = document.getElementsByClassName("student");
    for (var i = students.length-1; i>=0; --i)
    {
        var first = document.getElementById("first_" + students[i].id).innerHTML;
        var li_stud = document.getElementById(students[i].id);
        var ul_group = document.getElementById(first);
        ul_group.appendChild(li_stud);
        document.getElementById("gcount_"+first).value = $(ul_group).children('li').length;
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
        if (removeMember(members[i])) break;
    }
});

function removeMember(student) {
    var second = document.getElementById("second_" + student.id).innerHTML;
    var third = document.getElementById("third_" + student.id).innerHTML;
    return false;
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
