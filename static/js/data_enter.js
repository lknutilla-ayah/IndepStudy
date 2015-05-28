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
  uploadClass(student_data, group_data);
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
    if (!grouplist[count]) continue;
    var tr = document.createElement("TR");
    for (var i = 0; i < 3 && count < grouplist.length; ++i)
    {
      if (!grouplist[i]) continue;
      var td = document.createElement("TD");
      var group_obj = document.createElement("DIV");
      group_obj.id = "obj_"+grouplist[count].id;
      $(group_obj).append(count + ".) ");
      $(group_obj).append(grouplist[count].id + " ");
      if (grouplist[count].presenter)
      {
        $(group_obj).append(grouplist[count].presenter + " ");
      }
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
    if (!classlist[i]) continue;
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
    if ($('#gender').prop("checked") && classlist[i].gender) $(student).append("M/F: " + classlist[i].gender + " ");
    if ($('#score').prop("checked") && classlist[i].score) $(student).append("Score: " +classlist[i].score + " ");
    if ($('#stud_pref').prop("checked") && (classlist[i].first || classlist[i].second || classlist[i].third)) 
    {
        $(student).append("Prefs:");
        if (classlist[i].first)
        {
          var first_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].first);
          if (first_pref != -1)
          {
            $(student).append('<label for="'+ student.id +'" id="first_'+ student.id +'" class="preference">'+ first_pref +'</label>');
          }
        }

        if (classlist[i].second)
        {
          var second_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].second);
          if (second_pref != -1)
          {
          $(student).append('<label for="'+ student.id +'" id="second_'+ student.id +'" class="preference">'+ second_pref +'</label>');
          }
        }
        
        if (classlist[i].third)
        {
          var third_pref = grouplist.map(function(obj) 
          {return obj.id; }).indexOf(classlist[i].third);
          if (third_pref != -1)
          {
            $(student).append('<label for="'+ student.id +'" id="third_'+ student.id +'" class="preference">'+ third_pref +'</label>');
          }
        } 
    }
    var group_ul = document.getElementById(classlist[i].group);
    $(group_ul).append(student);
    changeColor(student);
    checkLocks(classlist[i]);
  }
}

function uploadClass(student_data, group_data) 
{
  for (var i = 0; i < student_data.length; ++i)
  {
    if (!student_data[i].id) continue;
    var find_student = classlist.map(function(obj) 
        {return obj.id; }).indexOf(student_data[i].id);

    if (find_student != -1) updateStudent(student_data[i], classlist[find_student]);
    else 
    {
      var student = new Student(student_data[i]);
      classlist[classlist.length] = student;
    }
    for (var j = 0; j < classlist.length; ++j)
    {
      var find_student_data = student_data.map(function(obj) 
        {return obj.id; }).indexOf(classlist[j].id);
      if (find_student_data === -1) classlist.splice(j,1);
      if (!classlist[j].id) classlist.splice(j,1);
    }
  }
  for (var i = 0; i < group_data.length; ++i)
  {
    if (!group_data[i].id) continue;
    var find_group = grouplist.map(function(obj) 
        {return obj.id; }).indexOf(group_data[i].id);
    if (find_group != -1) updateGroup(group_data[i], grouplist[find_group]);
    else
    {
      var group = new Group(group_data[i]);
      grouplist[grouplist.length] = group;
    }
    for (var j = 0; j < grouplist.length; ++j)
    {
      var find_group_data = group_data.map(function(obj) 
        {return obj.id; }).indexOf(grouplist[j].id);
      if (find_group_data === -1) grouplist.splice(j,1);
      if (!grouplist[j]) grouplist.splice(j,1);
    }
  }
}

function Student(data)
{
  this.id = data.id;
  if ($('#gender').prop("checked") && data.gender) this.gender = data.gender;
  if ($('#score').prop("checked") && data.score) this.score = data.score;
  if ($('#stud_pref').prop("checked"))
  {
    if (data.first) this.first = data.first;
    if (data.second) this.second = data.second;
    if (data.third) this.third = data.third;
  }
  this.presenter = -1;
  this.group = "sortable_class";
  this.locked = false;
}

function updateStudent(data, student)
{
  if ($('#gender').prop("checked") && data.gender) student.gender = data.gender;
  else delete student.gender;
  if ($('#score').prop("checked") && data.score) student.score = data.score;
  else delete student.score;
  if ($('#stud_pref').prop("checked"))
  {
    if (data.first) student.first = data.first;
    else delete student.first;
    if (data.second) student.second = data.second;
    else delete student.second;
    if (data.third) student.third = data.third;
    else delete student.third;
  }
}

function Group(data)
{
  this.id = data.id;
  if (data.presenter) 
  {
    this.presenter = data.presenter;
    var pres_index = classlist.map(function(obj) 
        {return obj.id; }).indexOf(this.presenter);
    if (pres_index != -1) classlist[pres_index].presenter = this.id;
  }
  this.count = 0;
  this.deleted = false;
  this.preferred = [];
  for (var i = 1; i < num_pref; ++i)
  {
    if (!data["preference_"+i]) continue;
    this.preferred[this.preferred.length] = data["preference_"+i];
  }
}

function updateGroup(data, group)
{
  if (data.presenter) 
  {
    group.presenter = data.presenter;
    var pres_index = classlist.map(function(obj) 
        {return obj.id; }).indexOf(group.presenter);
    if (pres_index != -1) {
      classlist[pres_index].presenter = group.id;
    }
  }
  else delete group.presenter;
  group.preferred = [];
  for (var i = 1; i < num_pref; ++i)
  {
    if (!data["preference_"+i]) continue;
    group.preferred[group.preferred.length] = data["preference_"+i];
  }
}







