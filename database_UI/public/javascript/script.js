// function to create table of exersiese, take an array of all the exersises from the DB
function exersiseTable(dataArray){

  var tableDiv = document.getElementById("exersisetable");
  // make sure table is empty
  if(tableDiv.firstChild != null){
    tableDiv.removeChild(tableDiv.firstChild);
  }

  //Create Table for exercises
  var table = document.createElement("table");
  // Create header row
  var tableRowHead = document.createElement("tr");

  // creat all table headers
  var headCount = 1;
  var innerTextOptions = ['Date', 'Name', 'Reps', 'Weight', 'lb or kg', 'edit', 'delete'];
  
  while(headCount <= innerTextOptions.length) {
    let tableHeader = document.createElement("th");
    tableHeader.innerText = innerTextOptions[headCount - 1];
    tableRowHead.appendChild(tableHeader);
    headCount += 1;
  }
  // add table headers to the table
  table.appendChild(tableRowHead);

  // Generate Table Data
  // For every exercise in the array that was passed to the func, add a row and place info in it
  dataArray.forEach(function(row){
    var dataRow = document.createElement("tr");

    var exDate = document.createElement("td");
    var lb_or_kg = document.createElement("td");
    var editBtn = document.createElement("td");
    var deleteBtn = document.createElement("td");

    // fill date cell
    if(row["date"] != null){
      exDate.innerText = row["date"]
    }
    dataRow.appendChild(exDate);

    // fill data cells
    var datanames = ["name", "reps", "weight"];
    datanames.forEach(name => {
      let talbeData = document.createElement("td");
      talbeData.innerText = row[name];
      dataRow.appendChild(talbeData);
    });

    // fill lb or kg cell
    if(row["lbs"] == 1){
      lb_or_kg.innerText = "lbs";
    }
    else if(row["lbs"] == 0){
      lb_or_kg.innerText = "kgs";
    }
    dataRow.appendChild(lb_or_kg);

    /** Create edit button **/
    var button = document.createElement('a');
    button.innerText = 'Edit';
    button.setAttribute('class', "btn btn-info");
    button.setAttribute('href', '/edit?id='+row['id'])

    editBtn.appendChild(button);
    dataRow.appendChild(editBtn);
   
    /** Create delete button **/
    // the delete button the user will see
    var button = document.createElement('input');
    button.setAttribute('type',"button");
    button.setAttribute('value', "Delete");
    button.setAttribute('class', "btn btn-danger delete");
    // hidden form used to submit request
    var form = document.createElement('form');
    var forminput = document.createElement('input');
    forminput.setAttribute('type',"hidden");
    forminput.setAttribute('value',row["id"]);
    
    // add to form
    form.appendChild(forminput);
    form.appendChild(button);
    deleteBtn.appendChild(form);
    dataRow.appendChild(deleteBtn);

    table.appendChild(dataRow);
  }); // end for each loop

  tableDiv.appendChild(table);

  // // Add click event to edit buttons
  // var editButtons = document.getElementsByClassName("edit");
  // for (let i = 0; i < editButtons.length; i++) {
  //     editButtons[i].addEventListener('click', editEvent, false);
  // }

  // Add click event to delete buttons
  var deleteButtons = document.getElementsByClassName("delete");
  for (let i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', deleteWorkout, false);
  }
} // end function

// initial grab of data from database, want this to run every time home page is visited
var req = new XMLHttpRequest();
req.open("GET", "/querydb", true); // here is where the app.get('/get-data') is
req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load',function(){
  if(req.status >= 200 && req.status < 400){
    exersiseTable(JSON.parse(req.responseText));
  }
 });
req.send();

// add new exersise to the database
document.getElementById("addExercise").addEventListener("click", function(event){
  var req = new XMLHttpRequest();
  var payload = {};

  payload.date = document.getElementById('add_date').value || null;
  payload.name = document.getElementById('add_name').value || "Generic Exersise"; // MySQL requiers a value
  payload.reps = document.getElementById('add_reps').value || null;
  payload.weight = document.getElementById('add_weight').value || null;

  // check if lb or kg
  if(document.getElementById('add_unit').checked == true){
    payload.unit = 1;
  }
  else{
    payload.unit = 0;
  }
  // clear the form so it is blank
  document.getElementById('add_date').value = null; 
  document.getElementById('add_name').value = null;
  document.getElementById('add_reps').value = null;
  document.getElementById('add_weight').value = null;

  // send to app.post('/add') in node
  req.open("POST", "/add", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      // if get good response re-build the table with added exersise
      exersiseTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}); // end getElementById("addExercise")

// handle delete button press
function deleteWorkout(event){
  var req = new XMLHttpRequest();
  var id = this.previousSibling.value;
  var payload = {"id":id};

  // send to app.post('/delte') in node
  req.open("POST", "/delete", true);
  req.setRequestHeader("Content-Type","application/json");
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      // if good create the re create the table without the removed element
      exersiseTable(JSON.parse(req.responseText));
    }
    else {
        console.log("Error in network request: " + req.statusText);
      }
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}
