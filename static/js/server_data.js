$(document).ready( function() {
    $.get("/classinfo",function(data, status) {
        if (data.classlist.length != 0) classlist = data.classlist;
        if (data.grouplist.length != 0) grouplist = data.grouplist;
        if (data.settings) {
            settings = data.settings;
            $('#gender').prop('checked', data.settings.gender);
            if ($('#gender').prop("checked"))
            {
              cols[cols.length] = {data: 'gender'};
              colH[colH.length] = 'GENDER (M/F)';
            }            
            $('#score').prop('checked', data.settings.score);
            if ($('#score').prop("checked"))
            {
              cols[cols.length] = {data: 'score'};
              colH[colH.length] = 'SCORE';
            }
            $('#stud_pref').prop('checked', data.settings.stud_pref);
            if ($('#stud_pref').prop("checked"))
            {
              cols[cols.length] = {data: 'first'};
              colH[colH.length] = 'FIRST PREFERENCE';
              cols[cols.length] = {data: 'second'};
              colH[colH.length] = 'SECOND PREFERENCE';
              cols[cols.length] = {data: 'third'};
              colH[colH.length] = 'THIRD PREFERENCE';
            }
            $('#lead_pref').prop('checked', data.settings.lead_pref);
            if ($('#lead_pref').prop("checked"))
            {
              var pref = 'preference_'+ num_pref; 
              var pref_team = 'PREFERRED TEAMMATE '+ num_pref; ++num_pref;
              gcols[gcols.length] = {data: pref};
              gcolH[gcolH.length] = pref_team;
            }
            student_HT.updateSettings({columns: cols});
            student_HT.updateSettings({colHeaders: colH});
            student_HT.render(); 
            group_HT.updateSettings({columns: gcols});
            group_HT.updateSettings({colHeaders: gcolH});
            group_HT.render();

            $('#lock_fems').prop('checked', data.settings.lock_fems);
            $('#lock_pres').prop('checked', data.settings.lock_pres);
            $('#lock_prefs').prop('checked', data.settings.lock_prefs);
            $('#2nd').prop('checked', data.settings.sec);
            $('#3rd').prop('checked', data.settings.thrd);
        }
        $('#grp_tbl').empty();
        $('.student').remove();
        uploadGroupData();
        uploadStudentData();
        repopulateHT(data.classlist, data.grouplist, data.settings);
        uploadSortable();
    });
            
})

function repopulateHT(class_data, group_data, settings_data)
{
    student_HT.loadData(class_data);
    var group_HT_data = [];
    for (var i = 0; i < group_data.length; ++i)
    {
        var group = {};
        group.id = group_data[i].id;
        group.presenter = group_data[i].presenter;
        group.count = group_data[i].count;
        group.deleted = group_data[i].deleted;
        for (var j = 0; j < group_data[i].preferred.length; ++j)
        {
            group["preference_"+j] = group_data[i].preferred[j];
        }
        group_HT_data[group_HT_data.length] = group;

    }
    group_HT.loadData(group_HT_data);
    student_HT.render(); 
    group_HT.render(); 
}

$('#save').click(function() {
    $("#upload_settings").trigger("click"); 
    sendDataToServer();
});

$('#print').click(function() {
    $("#upload_settings").trigger("click"); 
    sendDataToServer();
});

function sendDataToServer() {
  $.ajax({
        url: '/sortinghat', // Location of the service
        type: 'POST', //GET or POST or PUT or DELETE verb
        data: JSON.stringify({classlist: classlist, grouplist: grouplist, settings: settings}), //Data sent to server
        contentType: 'application/json',
        processdata: true, //True or False
        crossDomain: true,
        error: ServiceFailed  // When Service call fails
    });
}

function ServiceFailed(result) {
  console.log("fail");
  Type = null; Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
}


