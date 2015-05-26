var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols, colH, gcols, gcolH,
  student_HT, group_HT,
  classlist = [], grouplist = [], settings = {},
  group_max, group_min, group_avg;

stud_container.style.width = '100%';
stud_container.style.overflow = "scroll";
group_container.style.width = '100%';
group_container.style.overflow = "scroll";


$('#upload_settings').click(function() { 
  settings.gender = $('#gender').prop("checked");
  settings.score = $('#score').prop("checked");
  settings.stud_pref = $('#stud_pref').prop("checked");
  settings.lead_pref = $('#lead_pref').prop("checked");
  settings.lock_fems = $('#lock_fems').prop("checked");
  settings.lock_pres = $('#lock_pres').prop("checked");
  settings.lock_prefs = $('#lock_prefs').prop("checked");
  settings.sec = $('#2nd').prop("checked");
  settings.thrd = $('#3rd').prop("checked");
});

$('#upload').click(function() {
  $('#grp_tbl').empty();
  $('.student').remove();
  var student_data = student_HT.getData();
  var group_data = group_HT.getData();
  classlist = [];
  grouplist = [];
  uploadClass(student_data, group_data);
  // if (classlist.length === 0) {
  //   uploadClass(student_data, group_data);
  // }
  // else {
  //   updateClass(student_data, group_data);
  // }
  uploadGroupData();
  uploadStudentData();

  var available_groups = grouplist.filter(function(obj)
            {return !obj.deleted});
  group_avg = Math.ceil((classlist.length)/(available_groups.length));
  group_max = group_avg +1;
  group_min = group_avg -1;

  uploadSortable();
  if (tutorial === "false")
  {
    $("#upload_settings").trigger("click"); 
    sendDataToServer();
  }

});

function uploadSortable()
{
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
              classlist[getClasslistIndex(student.id)].group = new_grp.id;
              changeColor(student);
              checkLocks(classlist[getClasslistIndex(student.id)]);
          }
      }
  });
  $( "#sortable_class" ).disableSelection();
}

function uploadGroupData() {
  var count = 0;
  while (count < grouplist.length)
  {
    var tr = document.createElement("TR");
    for (var i = 0; i < 3 && count < grouplist.length; ++i)
    {
      var td = document.createElement("TD");
      var group_obj = document.createElement("DIV");
      group_obj.id = "obj_"+grouplist[count].id;
      $(group_obj).append(count + ".) ");
      $(group_obj).append(grouplist[count].id + " ");
      $(group_obj).append(grouplist[count].presenter + " ");
      var group_size = document.createElement("INPUT");
        group_size.className += "grp_sz_box";
        group_size.id = "gcount_" + grouplist[count].id;
        group_size.type = "number";
        group_size.value = grouplist[count].count;
        group_size.readOnly = "true";
      $(group_obj).append(group_size);

      var group_members_ul = document.createElement("UL"); 
      group_members_ul.className += "droptrue group_mems group_ul";
      group_members_ul.id = grouplist[count].id;
      group_members_ul.style.backgroundColor = "white";

      var group_btns = document.createElement("DIV");
        group_btns.className += "btn-group";
        group_btns.role = "group";
          var add_btn = document.createElement("BUTTON");
          add_btn.className += "btn btn-default add_mem";
          add_btn.id = "a_" + grouplist[count].id;
          $(add_btn).append('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>');
          add_btn.onclick = function(event) { addNewMember(this); };
          $(group_btns).append(add_btn);
          
          var sub_btn = document.createElement("BUTTON");
          sub_btn.className += "btn btn-default remove_mem";
          sub_btn.id = "r_" + grouplist[count].id;
          $(sub_btn).append('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
          sub_btn.onclick = function(event) { removeMember(this); };
          $(group_btns).append(sub_btn);
          
          var delete_btn = document.createElement("BUTTON");
          delete_btn.className += "btn btn-default delete_grp";
          delete_btn.id = "d_" + grouplist[count].id;
          $(delete_btn).append('<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>');
          delete_btn.onclick = function(event) { deleteGroup(this); };
          $(group_btns).append(delete_btn);
      $(group_obj).append(group_btns);
      //<input type ="hidden" value="{{ group.preferences }}" id="prefs_{{ group.id }}">
      $(group_obj).append(group_members_ul);
      $(td).append(group_obj);
      $(tr).append(td);
      ++count;
    }
    $('#grp_tbl').append(tr);
  }
}

function uploadStudentData() {
  for (var i = 0; i < classlist.length; ++i)
  {
    if (classlist[i].id === null) continue;
    var student = document.createElement("LI");
    student.className += "ui-state-default list-group-item student";
    student.id = classlist[i].id;
    var student_lock = document.createElement("BUTTON");
    student_lock.className += "btn btn-default btn-xs lock";
    student_lock.id = "lock_" + student.id;
    $(student_lock).append('<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>');
    student_lock.onclick = function(event) { lock(this); };
    $(student).append(student_lock);
    $(student).append(" " + classlist[i].id + " ");
    if ($('#gender').prop("checked")) $(student).append("M/F: " + classlist[i].gender + " ");
    if ($('#score').prop("checked")) $(student).append("Score: " +classlist[i].score + " ");
    if ($('#stud_pref').prop("checked")) 
    {
        $(student).append("Prefs:");
        var first_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].first);
        if (first_pref != -1)
        {
          $(student).append('<label for="'+ student.id +'" id="first_'+ student.id +'" class="preference">'+ first_pref +'</label>');
        }
        var second_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].second);
        if (second_pref != -1)
        {
        $(student).append('<label for="'+ student.id +'" id="second_'+ student.id +'" class="preference">'+ second_pref +'</label>');
        }
        var third_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].third);
        if (third_pref != -1)
        {
          $(student).append('<label for="'+ student.id +'" id="third_'+ student.id +'" class="preference">'+ third_pref +'</label>');
        }
    }
    var group_ul = document.getElementById(classlist[i].group);
    $(group_ul).append(student);
    if (student.id) changeColor(student);
    checkLocks(classlist[i]);
  }
}

function uploadClass(student_data, group_data) 
{
  for (var i = 0; i < student_data.length-1; ++i)
  {

    if (!student_data[i].id) continue;
    var student = new Student(student_data[i]);
    classlist[classlist.length] = student;
  }
  for (var i = 0; i < group_data.length-1; ++i)
  {
    if (!group_data[i].id) continue;
    var group = new Group(group_data[i]);
    grouplist[grouplist.length] = group;
  }
}

// function updateClass(student_data, group_data) 
// {
//   for (var i = 0; i < student_data.length-1; ++i)
//   {
//     var inClass = classlist.map(function(obj) 
//         {return obj.id; }).indexOf(student_data[i].id);
//     if (inClass != -1)//in class
//     {
//       var student = classlist[inClass];
//       if ($('#gender').prop("checked")) student.gender = student_data[i].gender;
//       if ($('#score').prop("checked")) student.score = student_data[i].score;
//       if ($('#stud_pref').prop("checked"))
//       {
//         if (student_data[i].first != undefined ) student.first = student_data[i].first;
//         if (student_data[i].second != undefined ) student.second = student_data[i].second;
//         if (student_data[i].third != undefined ) student.third = student_data[i].third;
//       }
//     }
//     else
//     {
//       if (!student_data[i].id || student_data[i].id === null) continue;
//       var student = new Student(student_data[i]);
//       classlist[classlist.length] = student;
//     }
//   }
//   for (var i = 0; i < group_data.length-1; ++i)
//   {
//     var inGroup = grouplist.map(function(obj) 
//         {return obj.id; }).indexOf(group_data[i].id);
//     if (inGroup != -1)//in class
//     {
//       var group = grouplist[inGroup];
//       group.presenter = group_data[i].presenter;
//       var pres_index = classlist.map(function(obj) 
//           {return obj.id; }).indexOf(group.presenter);
//       classlist[pres_index].presenter = group.id;
//       group.preferred = [];
//       for (var j = 1; j < num_pref; ++j)
//       {
//         if (group_data[i]["preference_"+j] === undefined ) continue;
//         group.preferred[group.preferred.length] = group_data[i]["preference_"+j];
//       }
//     }
//     else
//     {
//       if (!group_data[i].groupname) continue;
//       var group = new Group(group_data[i]);
//       grouplist[grouplist.length] = group;
//     }
//   }
// }

function Student(data)
{
  this.id = data.id;
  if ($('#gender').prop("checked")) this.gender = data.gender;
  if ($('#score').prop("checked")) this.score = data.score;
  if ($('#stud_pref').prop("checked"))
  {
    if (data.first != undefined && data.first != "") this.first = data.first;
    if (data.second != undefined && data.second != "") this.second = data.second;
    if (data.third != undefined && data.third != "") this.third = data.third;
  }
  this.presenter = -1;
  this.group = "sortable_class";
  this.locked = false;
}

function Group(data)
{
  this.id = data.id;
  this.presenter = data.presenter;
  var pres_index = classlist.map(function(obj) 
      {return obj.id; }).indexOf(this.presenter);
  classlist[pres_index].presenter = this.id;
  this.count = 0;
  this.deleted = false;
  this.preferred = [];
  for (var i = 1; i < num_pref; ++i)
  {
    if (data["preference_"+i] === undefined ) continue;
    this.preferred[this.preferred.length] = data["preference_"+i];
  }
}







