var express = require('express');
var app = express();//main app
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
var username = 'eecsuser';
var password = 'password4eecs';
var incorrect_auth = false;
var authenticated = false;
//debugging
var post_count = 0;

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

// /*******************************************************
//  *
//  *                  routes
//  *
//  *******************************************************/


app.get('/', function (req, res) {
    res.render('index', { 
        title: 'Login',
        heading: 'Login',
        incorrect: incorrect_auth
    });
});

app.post('/', function (req, res) {
    if (req.body.username === username
        && req.body.password === password) {
        authTimeout();
        authenticated = true;
        var site = '/sortinghat';
    }
    else {
        incorrect_auth = true;
        var site = '/';
    }
    res.header('Content-Length', site.length);
    res.send(site);
});

app.get('/sortinghat', function (req, res) {
    if (authenticated)
    {
        res.render('new_class_tpl', { 
            title: 'Create New Class',
            tutorial: false
        });
    }
    else res.redirect('/');
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

app.get('/print', function (req, res) {
    if (authenticated) {
        res.render('print_tpl', { 
            title: 'Print and Stats',
            tutorial: false
        });
    }
    else res.redirect('/');
});


app.get('/tutorial', function (req, res) {
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

function Student(data) {
    this.id = data.id;
    if (data.gender) this.gender = data.gender;
    if (data.score) this.score = parseInt(data.score);
    if (data.first) this.first = data.first;
    if (data.second) this.second = data.second;
    if (data.third) this.third = data.third;
    this.presenter = data.presenter;
    this.group = data.group;
    this.locked = data.locked;
}

function setClasslist(class_data) {
    for (var i = 0; i < class_data.length; ++i)
    {
        var student = new Student (class_data[i]);
        classlist[classlist.length] = student;
    }
}

function Group(data) {
    this.id = data.id;
    if (data.presenter) this.presenter = data.presenter;
    this.count = data.count;
    this.deleted = data.deleted;
    this.preferred = data.preferred;
}

function setGrouplist(group_data) {
    for (var i = 0; i < group_data.length; ++i)
    {
        var group = new Group (group_data[i]);
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

function authTimeout() {
    setTimeout(function(){ authenticated = false; }, 10800000);
}





