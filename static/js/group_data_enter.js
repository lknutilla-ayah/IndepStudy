var num_pref = 1;

function createGCols() {
    gcols = [{data: 'groupname'}, {data: 'presenter'}];
    gcolH = ['GROUP NAME', 'PROPORSAL PRESENTER'];
};
createGCols();

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

group_HT = new Handsontable(group_container, {
  data: [],
  dataSchema: {groupname: null, uniqname: null},
  colHeaders: gcolH,
  columns: gcols,
  stretchH: 'all',
  minSpareRows: 1,
  contextMenu: true
});
