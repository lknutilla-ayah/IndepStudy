function addStudentFromList(student) {
    var top_choice;
    var first_data = grouplist[getGrouplistIndex(student.first)];
    var second_data = grouplist[getGrouplistIndex(student.second)];
    var third_data = grouplist[getGrouplistIndex(student.third)];
    if (student.first != undefined && !first_data.deleted) top_choice = student.first;
    else if (student.second != undefined && !second_data.deleted) top_choice = student.second;
    else if (student.third != undefined && !third_data.deleted) top_choice = student.third;
    else return;//leave in class list 
    student.group = top_choice;
    var ul_group = document.getElementById(top_choice);
    var student_li = document.getElementById(student.id);
    ul_group.appendChild(student_li);
    changeColor(student_li);
    updateCount(ul_group);
    checkLocks(student);
}

function addMember(student_li, new_grp, old_grp) {
    new_grp.appendChild(student_li);
    classlist[getClasslistIndex(student_li.id)].group = new_grp.id;
    if (old_grp.id != "sortable_class") updateCount(old_grp);
    if (new_grp.id != "sortable_class") updateCount(new_grp);
    changeColor(student_li);
    checkLocks(classlist[getClasslistIndex(student_li.id)]);
}

function sortGroupL2H(list,attr) {
    list = list.sort(function(a, b) {
        a = a[attr];
        b = b[attr];
        return a-b;
    });
}

function sortGroupH2L(list,attr) {
    list = list.sort(function(a, b) {
        a = a[attr];
        b = b[attr];
        return b-a;
    });
}

function getGrouplistIndex(group_id)
{
    var index = grouplist.map(function(obj) 
        {return obj.id; }).indexOf(group_id);
    return index;
}

function getClasslistIndex(student_id)
{
    var index = classlist.map(function(obj) 
        {return obj.id; }).indexOf(student_id);
    return index;
}

function updateCount(group) {
    grouplist[getGrouplistIndex(group.id)].count = $(group).children('li').length;
    document.getElementById("gcount_"+group.id).value = $(group).children('li').length;
}

function changeColor(student_li) {
    var student = classlist[getClasslistIndex(student_li.id)];
    var group = student_li.parentNode.id;
    var first = document.getElementById("first_" + student.id);
    var second = document.getElementById("second_" + student.id);
    var third = document.getElementById("third_" + student.id);
    // if ($('#gender').prop("checked") && student.gender === "F")
    // {
    //     $(student_li).addClass("female");
    // }
    if ($('#stud_pref').prop("checked"))
    { 
        if (first && student.first === student.group) {
            first.style.color = "#00CC99";
            second.style.color = "black";
            third.style.color = "black";
        }
        else if (second && student.second === student.group) {
            second.style.color = "#FFC266";
            first.style.color = "black";
            third.style.color = "black";
        }
        else if (third && student.third === student.group) {
            third.style.color = "#A30000";
            second.style.color = "black";
            first.style.color = "black";
        }
        else {
            if (first) first.style.color = "black";
            if (second) second.style.color = "black";
            if (third) third.style.color = "black";
        }
    }
    if ($('#lock_pres').prop("checked"))
    {
        if (student.presenter === student.group) $(student_li).removeClass("pres_danger");
    }
}
