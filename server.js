var express = require('express');
var app = express();//main app
var admin = express();//admin subapp
var http = require('http').Server(app);
var path = require('path');
var swig = require('swig');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//define global variables//
var class_list = [];
var settings = true;
var class_obj;

// define object constructors
function newClass(classname, start, end, gender, score, stud_pref, lead_pref) {
    this.classname = classname;
    this.gender = gender;
    this.score = score;
    this.startDate = start;
    this.endDate = end;
    this.stud_pref = stud_pref;
    this.lead_pref = lead_pref;
    settings = false;
}


//define templates//
var header_tpl = swig.compileFile('views/header.html');
var header_content = header_tpl({});
  swig.setDefaults({ locals: { header: header_content}});
var form_1_tpl = swig.compileFile('views/new_class_form_1.html');
var new_class_form_1 = form_1_tpl({});
var form_2_tpl = swig.compileFile('views/new_class_form_2.html');
var new_class_form_2 = form_1_tpl({});


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

app.get('/', function (req, res) {
  res.render('index', { 
        title: 'Home',
    });
});

app.get('/create', function (req, res) {
    res.render('new_class_form_1', { 
        title: 'Create New Survey',
        heading: 'Survey Setting',
        date: settings
    });
});

app.get('/upload', function (req, res) {
    res.render('new_class_form_2', { 
        title: 'Create New Survey',
        heading: 'Upload Files',
        class_obj: class_obj
    });
});
// accept POST request from settings
app.post('/create', function (req, res) {
    addClassName(req);
    res.redirect("/upload");
});

app.post('/upload', function (req, res) {
    console.log(req.body.student_data);
    
});

app.get('/student', function (req, res) {
  res.render('student_tpl', { 
        title: 'Student Form',
        class_list: class_list 
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

function addClassName(req) {
    var name = req.body.newClass;
    req.params.name = name;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var gender = req.body.gender;
    var score = req.body.survey;
    var stud_pref = req.body.stud_pref;
    var lead_pref = req.body.lead_pref;
    class_obj = new newClass(name, startDate, endDate, gender, score, stud_pref, lead_pref);
    class_list[class_list.length] = name;
}

function addClassList(req) {
    // class_obj.stud_list = req.body.students_enter;
    // class_obj.group_list = req.body.groups_enter;
    console.log("enter: " + req.body.student_data);
}





