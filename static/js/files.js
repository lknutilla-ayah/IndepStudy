var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols, colH, gcols, gcolH,
  jsondataStudent, jsondataGroup,
  student_HT, group_HT;

var num_pref = 1;

stud_container.style.width = '100%';
stud_container.style.overflow = "scroll";
group_container.style.width = '100%';
group_container.style.overflow = "scroll";

function createCols() {
  cols = [{data: 'uniqname'}];
  colH = ['UNIQNAME'];
  if (gender === "on") {
    cols[cols.length] = {data: 'gender'};
    colH[colH.length] = 'GENDER (M/F)';
  }
  if (score === "on") {
    cols[cols.length] = {data: 'score'};
    colH[colH.length] = 'SCORE';
  } 
  if (stud_pref === "on") {
    cols[cols.length] = {data: 'first'};
    colH[colH.length] = 'FIRST PREFERENCE';
    cols[cols.length] = {data: 'second'};
    colH[colH.length] = 'SECOND PREFERENCE';
    cols[cols.length] = {data: 'third'};
    colH[colH.length] = 'THIRD PREFERENCE';
  }
};
createCols();

function getData() {
  if (upload_data) {
    //var class_data = JSON.parse(res.response);
    console.log(upload_data);
    // student_HT.loadData(class_data);
    console.log("ghere");
    // group_data = JSON.parse(group_data);
    // group_HT.loadData(group_data);
  }
}
getData();

  // dat_data = JSON.parse(dat_data);
  // student_HT.loadData(dat_data.data);

student_HT = new Handsontable(stud_container, {
  data: [],
  dataSchema: {uniqname: null, gender: null, score: null},
  colHeaders: colH,
  columns: cols,
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true
});

function createGCols() {
    gcols = [{data: 'groupname'}, {data: 'leader'}];
    gcolH = ['GROUP NAME', 'PROPORSAL PRESENTER'];
    if (lead_pref === "on") {
      var pref = 'preference_'+ num_pref; 
      var pref_team = 'PREFERRED TEAMMATE '+ num_pref; ++num_pref;
      gcols[gcols.length] = {data: pref};
      gcolH[gcolH.length] = pref_team;
    }
};
createGCols();

$("#add_pref").click(function(){
  var pref = 'preference_'+ num_pref; 
  var pref_team = 'PREFERRED TEAMMATE '+ num_pref; ++num_pref;
  gcols[gcols.length] = {data: pref};
  gcolH[gcolH.length] = pref_team;
  group_HT.updateSettings({columns: gcols});
  group_HT.updateSettings({colHeaders: gcolH});
  group_HT.render();
});

$("#sub_pref").click(function(){
  gcols.splice(gcols.length-1, 1);
  gcolH.splice(gcolH.length-1, 1); --num_pref;
  group_HT.updateSettings({columns: gcols});
  group_HT.updateSettings({colHeaders: gcolH});
  group_HT.render();
});

group_HT = new Handsontable(group_container, {
  data: [],
  dataSchema: {groupname: null, uniqname: null},
  colHeaders: gcolH,
  columns: gcols,
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true
});

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







