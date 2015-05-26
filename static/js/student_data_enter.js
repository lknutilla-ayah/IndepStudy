
function createCols() {
  cols = [{data: 'id'}];
  colH = ['UNIQNAME']; 
};
createCols();

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

student_HT = new Handsontable(stud_container, {
  data: [],
  colHeaders: colH,
  columns: cols,
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true
});
    
