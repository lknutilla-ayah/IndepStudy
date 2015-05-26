var express = require('express');
var app = express();//main app
//var admin = express();//admin subapp
var http = require('http').Server(app);
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//define global variables//
var classlist = [];
var grouplist = [];
var settings = {};

//define templates//
var header_tpl = swig.compileFile('views/header.html');
var header_content = header_tpl({});
  swig.setDefaults({ locals: { header: header_content}});


// /*******************************************************
//  *
//  *                  begin everything
//  *
//  *******************************************************/
startListen();
// This is where all the magic happens!
app.use(express.static(path.join(__dirname, 'static')));
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');


// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

// app.get('/', function (req, res) {
//   res.render('index', { 
//         title: 'Home',
//     });
// });

app.get('/', function (req, res) {
    res.render('index', { 
        title: 'Login',
        heading: 'Login',
        password: 'password4eecs'
    });
});

app.get('/sortinghat', function (req, res) {
    res.render('new_class_tpl', { 
        title: 'Create New Class',
        tutorial: false
    });
});

app.post('/sortinghat', function (req, res) {
    classlist = [];
    grouplist = [];
    setClasslist(req.body.classlist);
    setGrouplist(req.body.grouplist);
    setSettings(req.body.settings);
});

app.get('/classinfo', function (req, res) {
    var class_info = {classlist: classlist, grouplist: grouplist, settings: settings};
    res.send(class_info);
});


app.get('/tutorial', function (req, res) {
    //addDummyData();
    res.render('new_class_tpl', { 
        title: 'Tutorial',
        tutorial: true 
    });
});

/*******************************************************
 *
 *                  utility functions
 *
 *******************************************************/

function startListen() {
    var port = Number(process.env.PORT || 5000);
    http.listen(port, function() {
    console.log('listening on *:' + port);
    });
}

function Student(id, gender, score, first, second, third, presenter, group, locked) {
    this.id = id;
    this.gender = gender;
    this.score = parseInt(score);
    this.first = first;
    this.second = second;
    this.third = third;
    this.presenter = presenter;
    this.group = group;
    this.locked = locked;
}

function setClasslist(class_data) {
    for (var i = 0; i < class_data.length; ++i)
    {
        var id = class_data[i].id;
        var gender = class_data[i].gender;
        var score = class_data[i].score;
        var first = class_data[i].first;
        var second = class_data[i].second;
        var third = class_data[i].third;
        var presenter = class_data[i].presenter;
        var group = class_data[i].group;
        var locked = class_data[i].locked;
        var student = new Student (id, gender, score, first, second, third, presenter, group, locked);
        classlist[classlist.length] = student;
    }
}

function Group(id, presenter, count, deleted, preferred) {
    this.id = id;
    this.presenter = presenter;
    this.count = count;
    this.deleted = deleted;
    this.preferred = preferred;
}

function setGrouplist(group_data) {
    for (var i = 0; i < group_data.length; ++i)
    {
        var id = group_data[i].id;
        var presenter = group_data[i].presenter;
        var count = group_data[i].count;
        var deleted = group_data[i].deleted;
        var preferred = group_data[i].preferred;
        var group = new Group (id, presenter, count, deleted, preferred);
        grouplist[grouplist.length] = group;
    }
}

function setSettings(settings_data) {
    settings.gender = settings_data.gender;
    settings.score = settings_data.score;
    settings.stud_pref = settings_data.stud_pref;
    settings.lead_pref = settings_data.lead_pref;
    settings.lock_fems = settings_data.lock_fems;
    settings.lock_pres = settings_data.lock_pres;
    settings.lock_prefs = settings_data.lock_prefs;
    settings.sec = settings_data.sec;
    settings.thrd = settings_data.thrd;
}
// function updateSettings(req) {
//     console.log(cur_class.gender);
//     cur_class.classname = req.body.classname;
//     //req.params.name = name;
//     //var startDate = req.body.startDate;
//     //var endDate = req.body.endDate;
//     cur_class.gender = req.body.gender;
//     cur_class.score = req.body.survey;
//     cur_class.stud_pref = req.body.stud_pref;
//     cur_class.lead_pref = req.body.lead_pref;
//     console.log(cur_class.gender);
//     console.log(cur_class.classname);
//     //cur_class = new newClass(name, startDate, endDate, gender, score, stud_pref, lead_pref);
//     // cur_class = new newClass(name, gender, score, stud_pref, lead_pref);
//     // class_list[class_list.length] = cur_class;
// }
   


// function addClassName(req) {
//     var name = req.body.newClass;
//     req.params.name = name;
//     //var startDate = req.body.startDate;
//     //var endDate = req.body.endDate;
//     var gender = req.body.gender;
//     var score = req.body.survey;
//     var stud_pref = req.body.stud_pref;
//     var lead_pref = req.body.lead_pref;
//     //cur_class = new newClass(name, startDate, endDate, gender, score, stud_pref, lead_pref);
//     cur_class = new newClass(name, gender, score, stud_pref, lead_pref);
//     class_list[class_list.length] = cur_class;
// }

// function addStudent(req) {
//     var data = req.body;
//     if (data.name) 
//     {
//         var new_student = new Student(data.name, data.gender, 
//             data.score, data.first, data.second, data.third);
//         cur_class.classlist[cur_class.classlist.length] = new_student;
//     }
// }

// function addGroupList(req) {
//     var data = req.body;
//     if (data.groupname) 
//     {
//         var new_group = new Group(data.groupname, data.leader, data.prefs, cur_class.grouplist.length);    
//         cur_class.grouplist[cur_class.grouplist.length] = new_group;
//     }
// }

// function convertStudentPreferences() {
//     for (var i = 0; i < cur_class.classlist.length; ++i) 
//     {
//         cur_class.classlist[i].first = getGroupID(cur_class.classlist[i].first);
//         cur_class.classlist[i].second = getGroupID(cur_class.classlist[i].second);
//         cur_class.classlist[i].third = getGroupID(cur_class.classlist[i].third);
//     }
//     pref_set = true;
// }

// function getGroupID(name) {
//     for (var i = 0; i < cur_class.grouplist.length; ++i) 
//     {
//         if (name == cur_class.grouplist[i].groupname) {
//             return cur_class.grouplist[i].id;
//         } 
//     }
// }

// function addDummyData() {
//     //function newClass(classname, gender, score, stud_pref, lead_pref)
//     cur_class.gender = true;
//     cur_class.score = true;
//     cur_class.stud_pref = true;
//     cur_class.lead_pref = true;
//     var group_names = ["Group 0", "Group 1", "Group 2", "Group 3", "Group 4"];
//     var pres_uniqs = ["lead0","lead1","lead2","lead3","lead4"];
//     var prefs = [["stud1","stud2"],[],[],["stud3"],[]];
//     var student_uniqs = ["lead0","lead1","lead2","lead3","lead4","stud1","stud2",
//     "stud3","stud4","stud5","stud6","stud7","stud8","stud9","stud10"];
//     for (var i = 0; i < group_names.length; ++i) //add groups
//     {
//         var new_group = new Group(group_names[i], pres_uniqs[i], prefs[i], i);
//         cur_class.grouplist[cur_class.grouplist.length] = new_group;
//     }
//     for (var i = 0; i < student_uniqs.length; ++i) //add students
//     {
//         var rand_gender = Math.floor(Math.random() * (2 - 0)); //random generate 0 or 1
//         var f_cut = Math.floor(Math.random() * (2 - 0)); //random generate 0 or 1
//         if (rand_gender && f_cut) rand_gender = "F";
//         else rand_gender = "M";
//         var rand_score = Math.floor(Math.random() * (21 - 0)); //random number [0,20]
//         var rand_first = Math.floor(Math.random() * (5 - 0)); //random number [0,16]
//         var rand_second = Math.floor(Math.random() * (5 - 0)); //random number [0,16]
//         while (rand_second == rand_first) {
//             rand_second = Math.floor(Math.random() * (5 - 0));
//         }
//         var rand_third = Math.floor(Math.random() * (5 - 0)); //random number [0,16]
//         while (rand_third == rand_second || rand_third == rand_first ) {
//             rand_third = Math.floor(Math.random() * (5 - 0));
//         }
//         var new_student = new Student(student_uniqs[i], rand_gender, 
//         rand_score, rand_first, rand_second, rand_third);
//         cur_class.classlist[cur_class.classlist.length] = new_student;
//     }
//     cur_class.classlist[cur_class.classlist.length] = new Student("stud11", "F", 
//         0);
//     cur_class.classlist[cur_class.classlist.length] = new Student("stud12", "M", 
//         15);
// }





