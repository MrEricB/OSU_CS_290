var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Connect to database
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '',
  user            : '',
  password        : '',
  database        : ''
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',8000);

app.use(express.static(__dirname + '/public'));

// Home page all data is gathered and rendered client side with ajax request to other routes (script.js)
app.get('/', function(req,res){
  res.render('home')
});

// Query the data base, 
app.get('/querydb', function(req,res,next){
  // send the new exersises list back to ajax request
  pool.query('SELECT * FROM workouts ORDER BY name', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    res.type('application/json');
    res.send(rows);
    });
});

// Gets data from client to add new completed exercise
app.post('/add', function(req,res,next){
  pool.query("INSERT INTO workouts (`name`, `date`,`reps`,`weight`,`lbs`) VALUES (?,?,?,?,?)", [req.body.name,req.body.date,req.body.reps,req.body.weight,req.body.unit], function(err, result){
    if(err){
      next(err);
      return;
    }

    // send the new exersises list back to ajax request
    pool.query('SELECT * FROM workouts ORDER BY name', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows);
      });
  });
});

app.post('/delete', function(req, res, next){
  pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    
    // send the new exersises list back to ajax request    
    pool.query('SELECT * FROM workouts ORDER BY name', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      res.type('application/json');
      res.send(rows); // send back
      });
  });
});


/***** Edit and update exersises ****/
app.get('/edit', function(req, res, next){
  var context = {}
  // query the db for one exersise
  pool.query('SELECT * FROM `workouts` WHERE id=?', [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var list = [];
    for(var row in rows) {
      list.push(
        {
          'name': rows[row].name, 
          'reps': rows[row].reps, 
          'weight': rows[row].weight, 
          'date':rows[row].date, 
          'lbs':rows[row].lbs,
          'id':rows[row].id
        }
      )
    } // end for loop

    context.results = list[0];
    res.render('edit', context);
  });
});

// Update an entry in the database with the new data from client
app.get('/update',function(req,res,next){
  pool.query("SELECT * FROM `workouts` WHERE id=?", 
      [req.query.id], 
      function(err, result){
          if(err){
              next(err);
              return;
          }
          if(result.length == 1){
              // get the current values from the database
              var curVals = result[0];

              pool.query('UPDATE `workouts` SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', 
              [req.query.exercise || curVals.name, 
              req.query.reps || curVals.reps, 
              req.query.weight || curVals.weight, 
              req.query.date || curVals.date, 
              req.query.lbs, 
              req.query.id],
              function(err, result){
                  if(err){
                      next(err);
                      return;
                  }
                  res.render('home');
              });
          }
  });
});

// Resets data in workouts database

app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});

app.use(function(req, res){
  res.status(404);
  res.render('404');
});
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});
app.listen(app.get('port'),function(){
  console.log("Server is running...")
});
