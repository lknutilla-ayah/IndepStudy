var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols, colH, gcols, gcolH,
  jsondataStudent, jsondataGroup,
  student_HT, group_HT,
  classlist = [],
  grouplist = [],
  group_max, group_min, group_avg;

/*
  INSERT ON DOCUMENT READY THAT DISABLES/ENABLES ANY SORT FUNCTION ITEM IF NOT CHECKED
*/

stud_container.style.width = '100%';
stud_container.style.overflow = "scroll";
group_container.style.width = '100%';
group_container.style.overflow = "scroll";

$('#upload').click(function() {
  //put in alert that data will be lost or handle case
  $('#grp_tbl').empty();
  $('.student').remove();
  if (classlist.length === 0) uploadClass();
  else updateClass();
  uploadGroupData();
  uploadStudentData();
  
  console.log(grouplist);
  console.log(classlist);

  var available_groups = grouplist.filter(function(obj)
            {return !obj.deleted});
  group_avg = Math.ceil((classlist.length)/(available_groups.length));
  group_max = group_avg +1;
  group_min = group_avg -1;

  uploadSortable();
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
  var group_data = group_HT.getData();
  var count = 0;
  while (count < group_data.length-1)
  {
    if (!group_data[count].groupname) continue;
    var tr = document.createElement("TR");
    for (var i = 0; i < 3 && count < group_data.length-1; ++i)
    {
      var td = document.createElement("TD");
      var group_obj = document.createElement("DIV");
      group_obj.id = "obj_"+group_data[count].groupname;
      $(group_obj).append(count + ".) ");
      $(group_obj).append(group_data[count].groupname + " ");
      $(group_obj).append(group_data[count].presenter + " ");
      var group_size = document.createElement("INPUT");
        group_size.className += "grp_sz_box";
        group_size.id = "gcount_" + group_data[count].groupname;
        group_size.type = "number";
        group_size.value = "0";
        group_size.readOnly = "true";
      $(group_obj).append(group_size);

      var group_members_ul = document.createElement("UL"); 
      group_members_ul.className += "droptrue group_mems group_ul";
      group_members_ul.id = group_data[count].groupname;
      group_members_ul.style.backgroundColor = "white";

      var group_btns = document.createElement("DIV");
        group_btns.className += "btn-group";
        group_btns.role = "group";
          var add_btn = document.createElement("BUTTON");
          add_btn.className += "btn btn-default add_mem";
          add_btn.id = "a_" + group_data[count].groupname;
          $(add_btn).append('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>');
          add_btn.onclick = function(event) { addNewMember(this); };
          $(group_btns).append(add_btn);
          
          var sub_btn = document.createElement("BUTTON");
          sub_btn.className += "btn btn-default remove_mem";
          sub_btn.id = "r_" + group_data[count].groupname;
          $(sub_btn).append('<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>');
          sub_btn.onclick = function(event) { removeMember(this); };
          $(group_btns).append(sub_btn);
          
          var delete_btn = document.createElement("BUTTON");
          delete_btn.className += "btn btn-default delete_grp";
          delete_btn.id = "d_" + group_data[count].groupname;
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
  var group_data = group_HT.getData();

  for (var i = 0; i < classlist.length; ++i)
  {
    var student = document.createElement("LI");
    student.className += "ui-state-default list-group-item student";
    student.id = classlist[i].id;
    $(student).append(classlist[i].id + ".) ");
    var student_lock = document.createElement("BUTTON");
    student_lock.className += "btn btn-default btn-xs lock";
    student_lock.id = "lock_" + student.id;
    $(student_lock).append('<span class="glyphicon glyphicon-lock" aria-hidden="true"></span>');
    student_lock.onclick = function(event) { lock(this); };
    $(student).append(student_lock);
    $(student).append(" " + classlist[i].id + " ");
    if ($('#gender').prop("checked")) $(student).append(classlist[i].gender + " ");
    if ($('#score').prop("checked")) $(student).append(classlist[i].score + " ");
    if ($('#stud_pref').prop("checked")) 
    {
        var first_pref = group_data.map(function(obj) 
          {return obj.groupname; }).indexOf(classlist[i].first);
        if (first_pref != -1)
        {
          $(student).append('<label for="'+ student.id +'" id="first_'+ student.id +'">'+ first_pref +'</label>');
        }
        var second_pref = group_data.map(function(obj) 
          {return obj.groupname; }).indexOf(classlist[i].second);
        if (second_pref != -1)
        {
        $(student).append('<label for="'+ student.id +'" id="second_'+ student.id +'">'+ second_pref +'</label>');
        }
        var third_pref = group_data.map(function(obj) 
          {return obj.groupname; }).indexOf(classlist[i].third);
        if (third_pref != -1)
        {
          $(student).append('<label for="'+ student.id +'" id="third_'+ student.id +'">'+ third_pref +'</label>');
        }
    }
    var group_ul = document.getElementById(classlist[i].group);
    $(group_ul).append(student);
    changeColor(student);
    checkLocks(classlist[i]);
  }
}

function uploadClass() 
{
  var student_data = student_HT.getData();
  var group_data = group_HT.getData();
  for (var i = 0; i < student_data.length-1; ++i)
  {
    if (!student_data[i].uniqname) continue;
    var student = new Student(student_data[i]);
    classlist[classlist.length] = student;
  }
  for (var i = 0; i < group_data.length-1; ++i)
  {
    if (!group_data[i].groupname) continue;
    var group = new Group(group_data[i]);
    grouplist[grouplist.length] = group;
  }
}

function updateClass() 
{
  var student_data = student_HT.getData();
  var group_data = group_HT.getData();
  for (var i = 0; i < student_data.length-1; ++i)
  {
    var inClass = classlist.map(function(obj) 
        {return obj.id; }).indexOf(student_data[i].uniqname);
    if (inClass != -1)//in class
    {
      var student = classlist[inClass];
      if ($('#gender').prop("checked")) student.gender = student_data[i].gender;
      if ($('#score').prop("checked")) student.score = student_data[i].score;
      if ($('#stud_pref').prop("checked"))
      {
        if (student_data[i].first != undefined ) student.first = student_data[i].first;
        if (student_data[i].second != undefined ) student.second = student_data[i].second;
        if (student_data[i].third != undefined ) student.third = student_data[i].third;
      }
    }
    else
    {
      if (!student_data[i].uniqname) continue;
      var student = new Student(student_data[i]);
      classlist[classlist.length] = student;
    }
  }
  for (var i = 0; i < group_data.length-1; ++i)
  {
    var inGroup = grouplist.map(function(obj) 
        {return obj.id; }).indexOf(group_data[i].groupname);
    if (inGroup != -1)//in class
    {
      var group = grouplist[inGroup];
      group.presenter = group_data[i].presenter;
      var pres_index = classlist.map(function(obj) 
          {return obj.id; }).indexOf(group.presenter);
      classlist[pres_index].presenter = group.id;
      group.preferred = [];
      for (var j = 1; j < num_pref; ++j)
      {
        if (group_data[i]["preference_"+j] === undefined ) continue;
        group.preferred[group.preferred.length] = group_data[i]["preference_"+j];
      }
    }
    else
    {
      if (!group_data[i].groupname) continue;
      var group = new Group(group_data[i]);
      grouplist[grouplist.length] = group;
    }
  }
}

function Student(data)
{
  this.id = data.uniqname;
  if ($('#gender').prop("checked")) this.gender = data.gender;
  if ($('#score').prop("checked")) this.score = data.score;
  if ($('#stud_pref').prop("checked"))
  {
    if (data.first != undefined ) this.first = data.first;
    if (data.second != undefined ) this.second = data.second;
    if (data.third != undefined ) this.third = data.third;
  }
  this.presenter = -1;
  this.group = "sortable_class";
  this.locked = false;
}

function Group(data)
{
  this.id = data.groupname;
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

/*
{% for student in class_data.classlist %}
<li class="ui-state-default list-group-item student" id="{{ student.name }}">
    {% set count = loop.index %}
    {{ count }}
    <button type="button" class="btn btn-default btn-xs lock" id="lock_{{ student.name }}"><span class="glyphicon glyphicon-lock" aria-hidden="true"></span></button> 
    <label for="{{ student.name }}" id="name_{{ student.name }}">{{ student.name }}</label>
    {% if class_data.gender %}
    M/F: 
    <label for="{{ student.name }}" id="gender_{{ student.name }}">{{ student.gender }}</label>
    {% endif %}
    {% if class_data.score %}
    Score: 
    <label for="{{ student.name }}" id="score_{{ student.name }}">{{ student.score }}</label>
    {% endif %}
    Prefs: 
    <label for="{{ student.name }}" id="first_{{ student.name }}">{{ student.first }}</label>
    <label for="{{ student.name }}" id="second_{{ student.name }}">{{ student.second }}</label>
    <label for="{{ student.name }}" id="third_{{ student.name }}">{{ student.third }}</label> 
</li>
{% endfor %}
*/
// $('#upload').click(function() {
//   var s_row_cnt = student_HT.countRows();
//   var g_row_cnt = group_HT.countRows();
//   for (var i = 0; i < s_row_cnt-1; ++i) //accounts for spare row
//   {
//     var data = student_HT.getDataAtRow(i);
//     if (data[0] === null) continue;
//     fillJSONStudent(data,i);
//     $.ajax({
//         url: '/upload', // Location of the service
//         type: 'POST', //GET or POST or PUT or DELETE verb
//         data: jsondataStudent, //Data sent to server
//         contentType: 'application/json',
//         processdata: true, //True or False
//         crossDomain: true,
//         error: ServiceFailed  // When Service call fails
//     });
//   }
//   for (var i = 0; i < g_row_cnt-1; ++i) //accounts for spare row
//   {
//     var data = group_HT.getDataAtRow(i);
//     if (data[0] === null) continue;
//     fillJSONGroup(data);
//     $.ajax({
//         url: '/upload', // Location of the service
//         type: 'POST', //GET or POST or PUT or DELETE verb
//         data: jsondataGroup, //Data sent to server
//         contentType: 'application/json',
//         processdata: true, //True or False
//         crossDomain: true,
//         error: ServiceFailed  // When Service call fails
//     });
//   }
//   submitData();
// });

// function submitData() {
//   $.ajax({
//     url: '/upload', // Location of the service
//     type: 'POST', //GET or POST or PUT or DELETE verb
//     data: JSON.stringify({class_data: student_HT.getData(), group_data: group_HT.getData(), 
//       student: false, group: false}),
//     contentType: 'application/json',
//     processdata: true, //True or False
//     crossDomain: true,
//     dataType: 'json', //Expected data format from server
//     success: function(data) {
//      window.location = data;
//     },
//     error: ServiceFailed  // When Service call fails
//   });
// }


// function ServiceFailed(result) {
//   console.log("fail");
//   Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
// }

// function fillJSONStudent(data) {
//   var name = data[0];
//   var var_cnt = 1;
//   if (gender) {
//     var gen = data[var_cnt]; ++var_cnt;
//   }
//   if (score) var scr = data[var_cnt]; ++var_cnt;
//   if (stud_pref) {
//     var first = data[var_cnt]; ++var_cnt;
//     var second = data[var_cnt]; ++var_cnt;
//     var third = data[var_cnt]; ++var_cnt;
//   }
//   jsondataStudent = JSON.stringify({name: name, gender: gen, score: scr, 
//      first: first, second: second, third: third, student: true, group: false});
// }

// function fillJSONGroup(data)
// {
//   var groupname = data[0];
//   var lead = data[1];
//   if (lead_pref) {
//     var lead_prefs = [];
//     for (var i = 2; i <= num_pref+1; ++i) //accounting for data start at idx 2
//     {
//       if (data[i] != null) lead_prefs[lead_prefs.length] = data[i];
//     }
//   }
//   jsondataGroup = JSON.stringify({groupname: groupname, leader: lead, prefs: lead_prefs, student: false, group: true});
// }

// Handsontable.Dom.addEvent(load, 'click', function() {
//   ajax('json/load.json', 'GET', '', function(res) {
//     var data = JSON.parse(res.response);

//     hot.loadData(data.data);
//     exampleConsole.innerText = 'Data loaded';
//   });
// });

// Handsontable.Dom.addEvent(save, 'click', function() {
//   // save all cell's data
//   ajax('json/save.json', 'GET', JSON.stringify({data: hot.getData()}), function (res) {
//     var response = JSON.parse(res.response);

//     if (response.result === 'ok') {
//       exampleConsole.innerText = 'Data saved';
//     }
//     else {
//       exampleConsole.innerText = 'Save error';
//     }
//   });
// });







