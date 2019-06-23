// Form 1 GET:
var apiKey = '****** your api Key here *******';
    
document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('placeSubmit').addEventListener('click', function(e){
        var location = document.getElementById('place').value;
        var req = new XMLHttpRequest();
        var loctype = document.getElementById('locationtype').value;
        if(loctype === 'zipcode'){
            req.open("GET", "https://api.openweathermap.org/data/2.5/weather?zip=" + location + ",us&units=imperial&appid=" + apiKey, true);
        } else {
            req.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + location + ",us&units=imperial&appid=" + apiKey, true);
        }

        req.send(null);
        req.addEventListener('load', function(){
            //clear the fields
            var dataPlace = document.getElementById("weatherHeader");
            while (dataPlace.firstChild) {
                dataPlace.removeChild(dataPlace.firstChild);
            }
            if(req.status >= 200 && req.status < 400){
            var data = JSON.parse(req.responseText)
                //update the weather fields
                var city = document.createElement('li');
                var description = document.createElement('li');
                var temp = document.createElement('li');
                var wind = document.createElement('li');

                city.textContent = "City: " + data["name"];
                description.textContent = "Weather: " + data["weather"][0]["description"];
                temp.textContent = "Temp: " + data["main"]["temp"];
                wind.textContent = "Wind: " + data["wind"]["speed"];
                
                dataPlace.appendChild(city);
                dataPlace.appendChild(description);
                dataPlace.appendChild(temp);
                dataPlace.appendChild(wind);
            } else {
                var dataPlace = document.getElementById("weatherHeader");
                var description = document.createElement('li');

                description.innerText = "Unfortunately we could not get data for the city/zipcode of " + location + ". Try again.";
                dataPlace.appendChild(description);
            }
        });
        e.preventDefault();
    });

});


// Form 2 POST:

document.getElementById('mybutton').addEventListener('click', function(e) {
    var payload;
    if(document.getElementById('jsonform').value == ''){
      payload = {'school': 'OSU', 'Major': 'Computer Science', 'Enrolled': true};
    } else {
      payload = JSON.parse(document.getElementById('jsonform').value);

    }
    var req = new XMLHttpRequest();
    req.open('POST', 'http://httpbin.org/post', true);
    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify(payload));
    req.addEventListener('load', function() {
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.response).data;
        //display the results to the page;
        var displayData = document.getElementById('POSTresponse')
        displayData.textContent = response;
      } else {
        console.log("There was an error in your POST request. Please Try Again.");
      }
    });

    e.preventDefault();
  });