var express = require('express');
var app = express();
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
var set_date = true;

// define object constructors
function newClass(classname, start, end, gender, score, stud_pref, lead_pref) {
    this.classname = classname;
    this.gender = gender;
    this.score = score;
    this.startDate = start;
    this.endDate = end;
    this.stud_pref = stud_pref;
    this.lead_pref = lead_pref;
    set_date = false;
}


//define templates//
var header_tpl = swig.compileFile('views/header.html');
var header_content = header_tpl({});
var admin_form_tpl_1 = swig.compileFile('views/new_class_form_1.html');
var admin_form_content_1 = admin_form_tpl_1({});
var admin_form_tpl_2 = swig.compileFile('views/new_class_form_2.html');
var admin_form_content_2 = admin_form_tpl_2({});

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
        header: header_content
    });
});

app.get('/admin', function (req, res) {
  res.render('new_class_tpl', { 
        title: 'Home',
        header: header_content,
        content: admin_form_content_1,
        date: set_date
    });
});

// accept POST request on the homepage
app.post('/admin', function (req, res) {
  var name = req.body.newClassSort;
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var gender = req.body.gender;
  var score = req.body.survey;
  var stud_pref = req.body.stud_pref;
  var lead_pref = req.body.lead_pref;
  var class_obj = new newClass(name, startDate, endDate, gender, score, stud_pref, lead_pref);
  addClassName(name);
  res.render('new_class_tpl', { 
        title: 'Create New Survey',
        header: header_content,
        content: admin_form_content_2,
        class_obj: class_obj
    });

});

app.get('/student', function (req, res) {
  res.render('student_tpl', { 
        title: 'Student Form',
        header: header_content,
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
    });
}

function addClassName(name) {
    class_list[class_list.length] = name;
    console.log(class_list);

}
