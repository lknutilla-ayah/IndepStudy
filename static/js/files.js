var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols,
  colH,
  jsondataStudent,
  jsondataGroup,
  student_HT;

var stud_data = [];
var group_data = [];

stud_container.style.width = '100%';
stud_container.style.overflow = "scroll";
group_container.style.width = '100%';
group_container.style.overflow = "scroll";

function createCols() {
    cols = [{data: 'id'}];
    colH = ['UNIQNAME'];
    if (gender === "on") {
      cols[cols.length] = {data: 'gender'};
      colH[colH.length] = 'GENDER';
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

function Student() {
  this.name = undefined;
  this.score = undefined;
  this.gender = undefined;
  this.first = undefined;
  this.second = undefined;
  this.third = undefined;
}

function Group() {
  this.groupname = undefined;
  this.name = undefined;
  this.lead_prefs = [];
}


student_HT = new Handsontable(stud_container, {
  data: [],
  dataSchema: {uniqname: null, gender: null, score: null},
  colHeaders: colH,
  columns: cols,
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true,
  afterChange: function(change, source) {
    if (change != null) {
      for (var i = 0; i < change.length; ++i) {
        if (stud_data[change[i][0]] === undefined) stud_data[change[i][0]] = new Student();
        if (change[i][1] === 'id') stud_data[change[i][0]].name = change[i][3];
        if (change[i][1] === 'gender') stud_data[change[i][0]].gender = change[i][3];
        if (change[i][1] === 'score') stud_data[change[i][0]].score = change[i][3];
      }
    }
  }
});

group_HT = new Handsontable(group_container, {
  data: [],
  dataSchema: {groupname: null, uniqname: null},
  colHeaders: ['GROUPNAME', 'PROPORSAL PRESENTER (uniqname)', 'LEADER PREFERENCES (uniqN, uniqN, ...)'],
  columns: [
    {data: 'groupname'},
    {data: 'id'},
    {data: 'preferences'}
  ],
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true,
  afterChange: function(change, source) {
    if (change != null) {
      for (var i = 0; i < change.length; ++i) {
        if (group_data[change[i][0]] === undefined) group_data[change[i][0]] = new Group();
        if (change[i][1] === 'groupname') group_data[change[i][0]].groupname = change[i][3];
        if (change[i][1] === 'id') group_data[change[i][0]].name = change[i][3];
      }
    }
  }
});

$('#submit').click(function() {
  console.log("clicked");
  for (var i = 0; i < stud_data.length; ++i)
  {
    fillJSONStudent(i);
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
  for (var i = 0; i < group_data.length; ++i)
  {
    console.log("entering group");
    fillJSONGroup(i);
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
  $.ajax({
      url: '/upload', // Location of the service
      type: 'POST', //GET or POST or PUT or DELETE verb
      data: JSON.stringify({student: false, group: false}),
      dataType: 'json', //Expected data format from server
      success: function(data) {
       window.location = data;
      },
      error: ServiceFailed  // When Service call fails
  });
})
function ServiceFailed(result) {
Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}

function fillJSONStudent(i)
{
  var Sname = JSON.stringify(stud_data[i].name);
  var Sgender = JSON.stringify(stud_data[i].gender);
  var Sscore = JSON.stringify(stud_data[i].score);
  var Sfirst = JSON.stringify(stud_data[i].first);
  var Ssecond = JSON.stringify(stud_data[i].second);
  var Sthird = JSON.stringify(stud_data[i].third);

  jsondataStudent = JSON.stringify({name: Sname, gender: Sgender, score: Sscore, 
    first: Sfirst, second: Ssecond, third: Sthird, student: true, group: false});
}

function fillJSONGroup(i)
{
  var Gname = JSON.stringify(group_data[i].groupname);
  var Gid = JSON.stringify(group_data[i].name);
  var Gprefs = [];
  Gprefs = group_data[i].lead_prefs;
  Gpref.split(",");//cut this and just pass the string if failure
  Gprefs = JSON.stringify(Gprefs);//might not work

  jsondataGroup = JSON.stringify({groupname: Gname, id: Gid, prefs: Gprefs, student: false, group: true});
}







