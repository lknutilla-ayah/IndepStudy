var
  stud_container = document.getElementById('students_enter'),
  group_container = document.getElementById('groups_enter'),
  cols,
  colH,
  student_HT;

var stud_data = [];
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
};
createCols();

function Student() {
  this.name = undefined;
  this.score = undefined;
  this.gender = undefined;
}


student_HT = new Handsontable(stud_container, {
  data: [],
  dataSchema: {uniqname: null, gender: null, score: null},
  colHeaders: colH,
  columns: cols,
  stretchH: 'all',
  minSpareRows: 2,
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
  colHeaders: ['GROUPNAME', 'PROPORSAL PRESENTER (uniqname)'],
  columns: [
    {data: 'groupname'},
    {data: 'id'}
  ],
  stretchH: 'all',
  minSpareRows: 2,
  contextMenu: true
});

$('#submit').click(function() {
  alert('clicked')
  $.ajax({
        url: "/upload",
        type: "POST",
        dataType: "json",
        data: {
            student_data: stud_data
        },
        contentType: "application/json",
        cache: false,
        timeout: 5000,
        complete: function() {
          //called when complete
          console.log('process complete');
        },

        success: function(data) {
          console.log(data);
          console.log('process sucess');
       },

      error: function() {
        console.log('process error');
      },
  });
})
