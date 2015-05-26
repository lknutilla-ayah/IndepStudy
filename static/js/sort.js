//global variables
    var lock_fems = false, lock_pres = false, lock_prefs = false;

$(document).ready( function() {
    $("#grp_range").ionRangeSlider({
        type: "double",
        min: 0,
        max: 7,
        from: 3,
        to: 5,
        onStart: function (data) {
            //not sure if this will work?
            data.from = group_min;
            data.to = group_max;
        },
        onChange: function (data) {
            group_min = data.from;
            group_max = data.to;
        }
    });
})


/*----CLASS LIST FUNCTIONS----*/

/*Description:Sorts students into their first choice, and gives the sorter
the ability to get a first approximation of class spread. If scores are provided, 
sorts groups by score low to high.
Disregards: max/min size, gender 
*/
$( "#sort_frst" ).click(function() {
    for (var i = 0; i < classlist.length; ++i)
    {
        if (classlist[i].locked) continue;
        addStudentFromList(classlist[i]);
    }
    if ($('#score').prop("checked")) $("#ordr_scr").trigger("click");
});
/*Description: Randomly sorts students into equally sized groups. 
Disregards: max/min size, gender, preference, score.*/
$( "#srt_rand" ).click(function() {
    $("#restart").trigger("click");
    for (var i = 0; i < classlist.length; ++i)
    {
        var rand_new_grp = Math.floor(Math.random() * (grouplist.length-0));
        while (!(grouplist[rand_new_grp].count < group_avg) || grouplist[rand_new_grp].deleted) 
        {

            rand_new_grp = Math.floor(Math.random() * (grouplist.length-0));
        }
        var student_li = document.getElementById(classlist[i].id);
        var old_group_ul = document.getElementById(classlist[i].group);
        var new_group_ul = document.getElementById(grouplist[rand_new_grp].id);
        addMember(student_li, new_group_ul, old_group_ul);
    }
});
/*Description: This function sorts any students in the 
Class List(id="sortable_class") evenly into the smallest groups.
Disregards: max/min size, gender, preference, score, lock */
$( "#srt_non" ).click(function() {
    sortGroupL2H(grouplist, 'count');
    var srt_class = $("#sortable_class").children('li');
    for (var i = srt_class.length-1; i >=0; --i)
    {
        var old_group_ul = document.getElementById("sortable_class");
        var new_group_ul = document.getElementById(grouplist[0].id);
        addMember(srt_class[i], new_group_ul, old_group_ul);
        sortGroupL2H(grouplist, 'count');
    }
});
/*Description: If gender is indicated, this function sorts any females into their top choice. 
This is useful because the sorter can sort all of the females first and lock them (separately), 
before sorting the whole class.
Disregards: max/min size, score */
$( "#srt_fem" ).click(function() {
    var female_list = classlist.filter(function(obj)
        {return obj.gender === "F"});
    for (var i = 0; i < female_list.length; ++i)
    {
        var student_li = document.getElementById(female_list[i].id);
        $(student_li).addClass("female");
        if (female_list[i].locked) continue;
        addStudentFromList(female_list[i]);
    }
});
/*Description: Places all students back into the Class List (id="sortable_class")
Disregards: all */
$( "#restart" ).click(function() {
    for (var i = 0; i < classlist.length; ++i)
    {
        var student_li = document.getElementById(classlist[i].id);
        var old_group_ul = document.getElementById(classlist[i].group);
        var new_group_ul = document.getElementById("sortable_class");
        addMember(student_li, new_group_ul, old_group_ul);
    }
});

/*----GROUP SORT FUNCTIONS----*/

/*Description: Sorts students by score highest to lowest
Disregards: gender, locks */
$( "#ordr_scr" ).click(function() {
    for (var i = 0; i < grouplist.length; ++i)
    {
        if (grouplist[i].deleted) continue;
        var members = classlist.filter(function(obj)
            {return obj.group === grouplist[i].id});
        sortGroupH2L(members,'score');
        for (var j = 0; j < members.length; ++j)
        {
            var student_li = document.getElementById(members[j].id);
            var group_ul = document.getElementById(grouplist[i].id);
            group_ul.appendChild(student_li);
        }
    }
});

/*Description: The function searches through the other groups to find students that prefer this group,
and moves them.
Disregards: gender (unless locked) */
function addNewMember(group_btn)
{
    var group = group_btn.id;
    group = group.replace('a_','');
    var group_data = grouplist[getGrouplistIndex(group)];
    if (group_data.deleted) {
        return;
    }
    var group_ul = document.getElementById(group);

    

    if (group_data.count >= group_max)
    {
        var adding = confirm("WARNING: " + group_ul.id + " is larger than the max group size ("
            + group_max +"). Cannot add member.");
        if (adding === false) return;
    }
    sortGroupH2L(grouplist,'count');
    for (var i = 0; i < grouplist.length; ++i)
    {
        if (grouplist[i].id === group_ul.id) continue;
        var members = classlist.filter(function(obj)
            {return obj.group === grouplist[i].id});
        if (members.length <= group_min) continue;
        if ($('#score').prop("checked")) sortGroupL2H(members, 'score');
        for (var j = 0; j < members.length; ++j)
        {
            if (members[j].locked) continue;
            var member_li = document.getElementById(members[j].id);
            if (members[j].first === group_ul.id)
            {
                var old_group_ul = document.getElementById(grouplist[i].id);
                addMember(member_li, group_ul, old_group_ul);
                return;
            }
            if ($('#2nd').prop("checked") && members[j].second === group_ul.id)
            {
                var old_group_ul = document.getElementById(grouplist[i].id);
                addMember(member_li, group_ul, old_group_ul);
                return;
            }
            if ($('#3rd').prop("checked") && members[j].third === group_ul.id)
            {
                var old_group_ul = document.getElementById(grouplist[i].id);
                addMember(member_li, group_ul, old_group_ul);
                return; 
            }
        }
    }
    alert("Could not find students would prefer to/ or are able to switch into " + group.id + 
        ". Consider allowing sorting into 2nd or 3rd preferences or deleting group." );
};

/*Description: The function removes students in the group based on rank and preference.
Disregards: gender (unless locked) */
function removeMember(group_btn)
{
    var group = group_btn.id;
    group = group.replace('r_','');
    var group_data = grouplist[getGrouplistIndex(group)];
    if (group_data.deleted) {
        return;
    }
    var group_ul = document.getElementById(group);

    var members = classlist.filter(function(obj)
        {return obj.group === group_ul.id});
    if (members.length <= group_min)
    {
        var removing = confirm("WARNING: " + group_ul.id +
         " is smaller than the min group size ("+ group_min +").");
        if (removing === false) return;
    }
    if ($('#score').prop("checked")) sortGroupL2H(members,'score');
    for (var i = 0; i < members.length; ++i)
    {
        if (members[i].locked) continue;
        var member_li = document.getElementById(members[i].id);
        var first = grouplist[getGrouplistIndex(members[i].first)];
        var second = grouplist[getGrouplistIndex(members[i].second)];
        var third = grouplist[getGrouplistIndex(members[i].third)];
        if( first.count < group_max && members[i].first != group_ul.id
            && !first.deleted)
        {
            var new_group_ul = document.getElementById(first.id);
            addMember(member_li, new_group_ul, group_ul);
            return;
        }
        else if ($('#2nd').prop("checked") && second.count < group_max 
            && members[i].second != group_ul.id && !second.deleted)
        {
            var new_group_ul = document.getElementById(second.id);
            addMember(member_li, new_group_ul, group_ul);
            return;
        }
        else if ($('#3rd').prop("checked") && third.count < group_max 
            && members[i].third != group_ul.id && !third.deleted)
        {
            var new_group_ul = document.getElementById(third.id);
            addMember(member_li, new_group_ul, group_ul);
            return;
        }
    }
    alert("Could not remove a member. Consider allowing sorting into 2nd or 3rd preferences.");

};

/*Description: The function deletes a group and places students in the Class List.
The group is no longer included in any functionality.
Disregards: all */
function deleteGroup(group_btn)
{
    var group = group_btn.id;
    group = group.replace('d_','');
    var group_ul = document.getElementById(group);

    var members = classlist.filter(function(obj)
        {return obj.group === group_ul.id});

    for (var i = 0; i < members.length; ++i)
    {
        var member_li = document.getElementById(members[i].id);
        var new_group_ul = document.getElementById("sortable_class");
        var old_group_ul = document.getElementById(members[i].group);
        addMember(member_li, new_group_ul, group_ul);
    }
    grouplist[getGrouplistIndex(group)].deleted = true;
    var available_groups = grouplist.filter(function(obj)
        {return !obj.deleted});
    group_avg = Math.ceil((classlist.length)/(available_groups.length));
    group_max = group_avg +1;
    group_min = group_avg -1;

    grouplist[getGrouplistIndex(group)].count = classlist.length+1; 
    $(group_ul).remove();
    var group_obj = document.getElementById("obj_"+group);
    $(group_obj).append('<label for="obj_"'+ group +'" id="delete_tag_'+ group +'">DELETED</label>');

    $(group_btn).empty();
    $(group_btn).append('<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>');
    group_btn.onclick = function(event) { reAddGroup(this); };  
};

/*Description: The function re-adds a group.
Disregards: all */
function reAddGroup(group_btn)
{
    var group = group_btn.id;
    group = group.replace('d_','');
    var group_ul = document.getElementById(group);

    grouplist[getGrouplistIndex(group)].deleted = false;
    var available_groups = grouplist.filter(function(obj)
        {return !obj.deleted});
    group_avg = Math.ceil((classlist.length)/(available_groups.length));
    group_max = group_avg +1;
    group_min = group_avg -1;

    grouplist[getGrouplistIndex(group)].count = 0; 

    var group_members_ul = document.createElement("UL"); 
    group_members_ul.className += "droptrue group_mems";
    group_members_ul.id = group;
    group_members_ul.style.backgroundColor = "white";
    var group_obj = document.getElementById("obj_"+group);
    $(group_obj).append(group_members_ul);
    var delete_tag = document.getElementById("delete_tag_"+ group);
    $(delete_tag).remove();
    uploadSortable();

    $(group_btn).empty();
    $(group_btn).append('<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>');
    group_btn.onclick = function(event) { deleteGroup(this); }; 
}


