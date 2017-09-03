$(document).ready(function() {

  // This function will display the current time //
  function updateClock() {

  	var clock = moment().format("h:mm:ss a");

  	$("#clock").html(clock);

  };

  // the current time will elapse by one second
  setInterval(updateClock, 1000)

  // Initialize Firebase
  var config = {

    apiKey: "AIzaSyBEvfvRzimElWF-3XO47hYG4yzqa7Jvd_s",
    authDomain: "aaron-project-c8c21.firebaseapp.com",
    databaseURL: "https://aaron-project-c8c21.firebaseio.com",
    projectId: "aaron-project-c8c21",
    storageBucket: "aaron-project-c8c21.appspot.com",
    messagingSenderId: "272640189163"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // when clicking on the add-train button, the following will happen...
  $("#add-train").on("click",function(event) {

  	event.preventDefault();

  	// these variables will hold the values from the four text inputs
  	var newTrain = $("#train-name").val().trim();
  	var newDestination = $("#destination").val().trim();
  	var newFirstTrain = $("#first-train").val().trim();
  	var newFrequency = $("#frequency").val().trim();

  	// create an object whose four properties will have as values the four abovementioned variables
  	var dataTrain = {

  		train: newTrain,
  		destination: newDestination,
  		firstTrain: newFirstTrain,
  		frequency: newFrequency
  	};

  	//add the dataTrain object to database
  	database.ref().push(dataTrain);

    // clear inputs of text
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");

  }); // END click event END //

  // after we've pushed the object, we now want to retrieve it and its properties
  database.ref().on("child_added", function (retrieve) {

    // log the database object
    console.log(retrieve.val());

    // store the database's object's properties in variables
    var train = retrieve.val().train;
    var destination = retrieve.val().destination;
    var firstTime = retrieve.val().firstTrain;
    var frequency = retrieve.val().frequency; 

    // convert the retrieved value into readable hours and minutes
    var firstTrainConverted = moment(firstTime, "hh:mm");
    // log this variable
    console.log(firstTrainConverted);
    // create a variable that will store the calculated difference (in minutes) between now and the train's first run
    var timeDiff = moment().diff(firstTrainConverted, "minutes");
    // log timeDiff
    console.log(timeDiff + " minutes have passed since the train's first stop");
    // use modulus to caculate the remainder, and store the remainder in a variable 
    var remainder = timeDiff % frequency;
    // log remainder
    console.log(remainder);
    // calculate how many minutes away is the next train
    var minAway = frequency - remainder;
    // log variable
    console.log("The next train is in " + minAway + " minute(s)");
    // cacluated the train's next arrival
    var nextStop = moment().add(minAway, "minutes");
    //convert the variable from unix time to readable hours and minutes
    nextStop = moment(nextStop).format("hh:mm");
    // log it
    console.log("The next train will arrive at " + nextStop);

    //display the pertinent information in the train schedule panel
    $("#train-table > tbody").append("<tr><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>"
      + nextStop + "</td><td>" + minAway + "</td></tr>");

  }); // END child_added END //

}); // END ready END //