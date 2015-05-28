var classlist = [], grouplist = [];

$(document).ready( function() {
  $.ajax({
    url:"/classinfo",  
    success:function(data) {
      classlist = data.classlist;
      grouplist = data.grouplist;
      print(); 
      getStats();
    }
   });    
})
function print() {
  for (var i = 0; i < grouplist.length; ++i)
  {
    var tr = document.createElement("TR");
    var th = document.createElement("TH");
    $(th).addClass("groupheader");
    $(th).append("GROUP: " + grouplist[i].id + " | PRESENTER: " + grouplist[i].presenter);
    $(tr).append(th);
    $('#print_tbl').append(tr);
    if (grouplist[i].deleted) continue;
    var members = classlist.filter(function(obj)
        {return obj.group === grouplist[i].id});
    for (var j = 0; j < members.length; ++j)
    {
      var tr = document.createElement("TR");
      var td = document.createElement("TD");
      $(td).append(members[j].id);
      $(tr).append(td);
      $('#print_tbl').append(tr);
    }
  }

}

function getStats() {
  group_avg = 0;
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).addClass("groupheader");
  $(th).append("GROUP STATS");
  $(tr).append(th);
  $('#stat_tbl').append(tr);
  for (var i = 0; i < grouplist.length; ++i)
  {
    var tr = document.createElement("TR");
    var td = document.createElement("TD");
    $(td).append(grouplist[i].id);
    $(tr).append(td);
    var td = document.createElement("TD");
    $(td).append(grouplist[i].count);
    $(tr).append(td);
    $('#stat_tbl').append(tr);
    group_avg += grouplist[i].count;
  }
  group_avg = group_avg/grouplist.length;
  grouplist.sort(function(a, b) {
      a = a.count;
      b = b.count;
      return a-b;
  });
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("GROUP MIN");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(grouplist[0].count);
  $(tr).append(td);
  $('#stat_tbl').append(tr);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("GROUP MAX");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(grouplist[grouplist.length-1].count);
  $(tr).append(td);
  $('#stat_tbl').append(tr);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("GROUP AVG");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(group_avg);
  $(tr).append(td);
  $('#stat_tbl').append(tr);

  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).addClass("groupheader");
  $(th).append("CLASS STATS");
  $(tr).append(th);
  $('#stat_tbl').append(tr);
  var first_count = classlist.filter(function(obj)
      {return obj.first === obj.group});
  var first_percent = Math.floor(first_count.length/classlist.length * 100);
  var second_count = classlist.filter(function(obj)
      {return obj.second === obj.group});
  var second_percent = Math.floor(second_count.length/classlist.length * 100);
  var third_count = classlist.filter(function(obj)
      {return obj.third === obj.group});
  var third_percent = Math.floor(third_count.length/classlist.length * 100);
  var none_count = classlist.length - (first_count.length + second_count.length + third_count.length);
  var none_percent = Math.floor(none_count/classlist.length * 100);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("Students with first choice");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(first_count.length);
  $(tr).append(td);
  var td = document.createElement("TD");
  $(td).append(first_percent + "%");
  $(tr).append(td);
  $('#stat_tbl').append(tr);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("Students with second choice");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(second_count.length);
  $(tr).append(td);
  var td = document.createElement("TD");
  $(td).append(second_percent + "%");
  $(tr).append(td);
  $('#stat_tbl').append(tr);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("Students with third choice");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(third_count.length);
  $(tr).append(td);
  var td = document.createElement("TD");
  $(td).append(third_percent + "%");
  $(tr).append(td);
  $('#stat_tbl').append(tr);
  var tr = document.createElement("TR");
  var th = document.createElement("TH");
  $(th).append("Students who did not receive one of their choices");
  $(tr).append(th);
  var td = document.createElement("TD");
  $(td).append(none_count);
  $(tr).append(td);
  var td = document.createElement("TD");
  $(td).append(none_percent + "%");
  $(tr).append(td);
  $('#stat_tbl').append(tr);

}
