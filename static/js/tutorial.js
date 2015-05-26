$(document).ready( function() {
    $('#gender').prop('checked', true);
    $('#score').prop('checked', true);
    $('#stud_pref').prop('checked', true);
    $('#lead_pref').prop('checked', true); 

    $("#upload").trigger("click");   
})
    var num_pref = 2;
    var group_array = [
        {groupname: "Group 0", presenter: "lead0", preference_1: "stud1"}, 
        {groupname: "Group 1", presenter: "lead1"}, 
        {groupname: "Group 2", presenter: "lead2"}, 
        {groupname: "Group 3", presenter: "lead3", preference_1: "stud3"}, 
        {groupname: "Group 4", presenter: "lead4"}
    ];

    var student_array = [
        {uniqname: "lead0", gender: "M", score: 1, first: "Group 0", second: "Group 1", third: "Group 3"},
        {uniqname: "lead1", gender: "M", score: 2, first: "Group 3", second: "Group 0", third: "Group 1"},
        {uniqname: "lead2", gender: "M", score: 2, first: "Group 3", second: "Group 0", third: "Group 1"},
        {uniqname: "lead3", gender: "F", score: 0, first: "Group 0", second: "Group 1", third: "Group 2"},
        {uniqname: "lead4", gender: "F", score: 5, first: "Group 1", second: "Group 2", third: "Group 3"},
        {uniqname: "stud1", gender: "M", score: 7, first: "Group 1", second: "Group 2", third: "Group 3"},
        {uniqname: "stud2", gender: "M", score: 1, first: "Group 4", second: "Group 3", third: "Group 0"},
        {uniqname: "stud3", gender: "F", score: 4, first: "Group 0", second: "Group 3", third: "Group 4"},
        {uniqname: "stud4", gender: "M", score: 6, first: "Group 3", second: "Group 4", third: "Group 0"},
        {uniqname: "stud5", gender: "M", score: 1, first: "Group 0", second: "Group 1", third: "Group 4"},
        {uniqname: "stud6", gender: "F", score: 8, first: "Group 1", second: "Group 4", third: "Group 0"},
        {uniqname: "stud7", gender: "F", score: 4, first: "Group 4", second: "Group 0", third: "Group 1"},
        {uniqname: "stud8", gender: "M", score: 1, first: "Group 0", second: "Group 1", third: "Group 2"},
        {uniqname: "stud9", gender: "F", score: 2, first: "Group 3", second: "Group 0", third: "Group 1"},
        {uniqname: "stud10", gender: "M", score: 3, first: "Group 1", second: "Group 3", third: "Group 4"},
        {uniqname: "stud11", gender: "M", score: 1},
        {uniqname: "stud12", gender: "F", score: 2},
        {uniqname: "stud13", gender: "M", score: 3},
        {uniqname: "stud14", gender: "F", score: 2},
        {uniqname: "stud15", gender: "M", score: 3}
    ];


function createCols() {
  cols = [{data: 'uniqname'}, {data: 'gender'}, {data: 'score'}, {data: 'first'}, {data: 'second'}, {data: 'third'}];
  colH = ['UNIQNAME','GENDER (M/F)','SCORE','FIRST PREFERENCE','SECOND PREFERENCE','THIRD PREFERENCE']; 
};
createCols();

    student_HT = new Handsontable(stud_container, {
      data: student_array,
      colHeaders: colH,
      columns: cols,
      stretchH: 'all',
      minSpareRows: 1,
      contextMenu: true
    });

    function createGCols() {
        gcols = [{data: 'groupname'}, {data: 'presenter'}, {data: 'preference_1'}];
        gcolH = ['GROUP NAME', 'PROPORSAL PRESENTER', 'PREFERRED TEAMMATE 1'];
    };
    createGCols();

    group_HT = new Handsontable(group_container, {
      data: group_array,
      colHeaders: gcolH,
      columns: gcols,
      stretchH: 'all',
      minSpareRows: 1,
      contextMenu: true
    });

$('#lead_pref').click(function() {
    if ($('#lead_pref').prop("checked"))
    {
      var pref = 'preference_'+ num_pref; 
      var pref_team = 'PREFERRED TEAMMATE '+ num_pref; ++num_pref;
      gcols[gcols.length] = {data: pref};
      gcolH[gcolH.length] = pref_team;
    }
    else if (num_pref > 1)
    {
      var settings = group_HT.getSettings();
      var pref_spot = settings.columns.map(function(obj) 
        {return obj.data; }).indexOf('preference_1');
      gcols.splice(pref_spot, num_pref);
      gcolH.splice(pref_spot, num_pref);
      num_pref = 1;
    }
    group_HT.updateSettings({columns: gcols});
    group_HT.updateSettings({colHeaders: gcolH});
    group_HT.render(); 
});

$("#add_pref").click(function(){
  if (!$('#lead_pref').prop("checked")) $('#lead_pref').prop('checked', true);
  var pref = 'preference_'+ num_pref; 
  var pref_team = 'PREFERRED TEAMMATE '+ num_pref; ++num_pref;
  gcols[gcols.length] = {data: pref};
  gcolH[gcolH.length] = pref_team;
  group_HT.updateSettings({columns: gcols});
  group_HT.updateSettings({colHeaders: gcolH});
  group_HT.render();
});

$("#sub_pref").click(function(){
  if (num_pref <= 1) return;
  gcols.splice(gcols.length-1, 1);
  gcolH.splice(gcolH.length-1, 1); --num_pref;
  if (num_pref <= 1) $('#lead_pref').prop('checked', false);
  group_HT.updateSettings({columns: gcols});
  group_HT.updateSettings({colHeaders: gcolH});
  group_HT.render();
});

$('#gender').click(function() {
    if ($('#gender').prop("checked"))
    {
      cols[cols.length] = {data: 'gender'};
      colH[colH.length] = 'GENDER (M/F)';
    }
    else
    {
      var settings = student_HT.getSettings();
      var gender_spot = settings.columns.map(function(obj) 
        {return obj.data; }).indexOf('gender');
      cols.splice(gender_spot, 1);
      colH.splice(gender_spot, 1);
    }
    student_HT.updateSettings({columns: cols});
    student_HT.updateSettings({colHeaders: colH});
    student_HT.render(); 
}); 

$('#score').click(function() {
    if ($('#score').prop("checked"))
    {
      cols[cols.length] = {data: 'score'};
      colH[colH.length] = 'SCORE';
    }
    else
    {
      var settings = student_HT.getSettings();
      var score_spot = settings.columns.map(function(obj) 
        {return obj.data; }).indexOf('score');
      cols.splice(score_spot, 1);
      colH.splice(score_spot, 1);
    }
    student_HT.updateSettings({columns: cols});
    student_HT.updateSettings({colHeaders: colH});
    student_HT.render(); 
});

$('#stud_pref').click(function() {
  if ($('#stud_pref').prop("checked"))
    {
      cols[cols.length] = {data: 'first'};
      colH[colH.length] = 'FIRST PREFERENCE';
      cols[cols.length] = {data: 'second'};
      colH[colH.length] = 'SECOND PREFERENCE';
      cols[cols.length] = {data: 'third'};
      colH[colH.length] = 'THIRD PREFERENCE';
    }
    else
    {
      var settings = student_HT.getSettings();
      var stud_pref_spot = settings.columns.map(function(obj) 
        {return obj.data; }).indexOf('first');
      cols.splice(stud_pref_spot, 3);
      colH.splice(stud_pref_spot, 3);
    }
    student_HT.updateSettings({columns: cols});
    student_HT.updateSettings({colHeaders: colH});
    student_HT.render();
});
