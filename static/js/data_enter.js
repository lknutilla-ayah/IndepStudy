var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols, colH, gcols, gcolH,
  jsondataStudent, jsondataGroup,
  student_HT, group_HT;

var num_pref = 1;

var set_gender = $('#gender').prop("checked");
var set_score = $('#score').prop("checked");
var stud_pref = $('#stud_pref').prop("checked");
var lead_pref = $('#lead_pref').prop("checked");

stud_container.style.width = '100%';
stud_container.style.overflow = "scroll";
group_container.style.width = '100%';
group_container.style.overflow = "scroll";

$('#upload').click(function() {
  var s_row_cnt = student_HT.countRows();
  var g_row_cnt = group_HT.countRows();
  for (var i = 0; i < s_row_cnt-1; ++i) //accounts for spare row
  {
    var data = student_HT.getDataAtRow(i);
    if (data[0] === null) continue;
    fillJSONStudent(data,i);
    $.ajax({
        url: '/upload', // Location of the service
        type: 'POST', //GET or POST or PUT or DELETE verb
        data: jsondataStudent, //Data sent to server
        contentType: 'application/json',
        processdata: true, //True or False
        crossDomain: true,
        error: ServiceFailed  // When Service call fails
    });
  }
  for (var i = 0; i < g_row_cnt-1; ++i) //accounts for spare row
  {
    var data = group_HT.getDataAtRow(i);
    if (data[0] === null) continue;
    fillJSONGroup(data);
    $.ajax({
        url: '/upload', // Location of the service
        type: 'POST', //GET or POST or PUT or DELETE verb
        data: jsondataGroup, //Data sent to server
        contentType: 'application/json',
        processdata: true, //True or False
        crossDomain: true,
        error: ServiceFailed  // When Service call fails
    });
  }
  submitData();
});

function submitData() {
  $.ajax({
    url: '/upload', // Location of the service
    type: 'POST', //GET or POST or PUT or DELETE verb
    data: JSON.stringify({class_data: student_HT.getData(), group_data: group_HT.getData(), 
      student: false, group: false}),
    contentType: 'application/json',
    processdata: true, //True or False
    crossDomain: true,
    dataType: 'json', //Expected data format from server
    success: function(data) {
     window.location = data;
    },
    error: ServiceFailed  // When Service call fails
  });
}


function ServiceFailed(result) {
  console.log("fail");
  Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}

function fillJSONStudent(data) {
  var name = data[0];
  var var_cnt = 1;
  if (gender) {
    var gen = data[var_cnt]; ++var_cnt;
  }
  if (score) var scr = data[var_cnt]; ++var_cnt;
  if (stud_pref) {
    var first = data[var_cnt]; ++var_cnt;
    var second = data[var_cnt]; ++var_cnt;
    var third = data[var_cnt]; ++var_cnt;
  }
  jsondataStudent = JSON.stringify({name: name, gender: gen, score: scr, 
     first: first, second: second, third: third, student: true, group: false});
}

function fillJSONGroup(data)
{
  var groupname = data[0];
  var lead = data[1];
  if (lead_pref) {
    var lead_prefs = [];
    for (var i = 2; i <= num_pref+1; ++i) //accounting for data start at idx 2
    {
      if (data[i] != null) lead_prefs[lead_prefs.length] = data[i];
    }
  }
  jsondataGroup = JSON.stringify({groupname: groupname, leader: lead, prefs: lead_prefs, student: false, group: true});
}

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







