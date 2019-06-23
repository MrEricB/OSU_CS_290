//start express app
var express = require('express');
var app = express();
//import handbares, and bodayparser
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

//set up bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//set templeate engine to hanglpars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//handle get request
app.get('/',function(req,res){
    // array to hold url params
    var params = [];
    for(var param in req.query){
        //push all the paramst to the array
        params.push({'name':param, 'value':req.query[param]})
    }
    var paramObj = {}; // object to pass to render and user in .handlebars
    paramObj.paramList = params; // add parmas to the obj we will pass
    res.render('getter', paramObj) 
});

// handle post request
app.post('/',function(req,res){
  //obj that will be passe to render and used in .handlebars
  var paramObj = {};
  // get the body params form the post 
    var bodyParams = [];
    for (var p in req.body){
      //push all the paramst to the array
      bodyParams.push({'name':p,'value':req.body[p]})
    }
    //add array to obj to be passed.
    paramObj.bodyList = bodyParams;

    //now get any url params
    var urlparams = [];
    for(var param in req.query){
      //push all the paramst to the array
      urlparams.push({'name':param, 'value':req.query[param]})
    }
    
    paramObj.urlList = urlparams;
    res.render('poster', paramObj);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});