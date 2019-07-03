// display current time
function updateClock() {
   const clock = moment().format("h:mm:ss a");
   $("#clock").text(clock);
};
// the current time will elapse by one second
setInterval(updateClock, 1000)
// initialize Firebase
const config = {
	apiKey: "AIzaSyBEvfvRzimElWF-3XO47hYG4yzqa7Jvd_s",
	authDomain: "aaron-project-c8c21.firebaseapp.com",
	databaseURL: "https://aaron-project-c8c21.firebaseio.com",
	projectId: "aaron-project-c8c21",
	storageBucket: "aaron-project-c8c21.appspot.com",
	messagingSenderId: "272640189163"
};
firebase.initializeApp(config);
const database = firebase.database();

$("#add-train").on("click", event => {
	event.preventDefault();

	const train = $("#train-name").val().trim();
	const destination = $("#destination").val().trim();
	const firstTrain = moment($("#first-train").val().trim(), "HH:mm").subtract(10, "years").format("X");
	const frequency = $("#frequency").val().trim();

  	const dataTrain = {
    	train,
    	destination,
    	firstTrain,
   	frequency
  	};
	//add the dataTrain object to database
	database.ref().push(dataTrain);
	// clear inputs of text
	$("#train-name").val("");
	$("#destination").val("");
	$("#first-train").val("");
	$("#frequency").val("");
});

database.ref().on("child_added", retrieve => {
	// store the database object's properties in variables
	const { train, destination, firstTrain, frequency } = retrieve.val();
	// convert the retrieved value into readable hours and minutes
	const firstTrainConverted = moment.unix(firstTrain);
	// calculate the difference (in minutes) between now and the train's first run
	// use modulus to caculate the remainder, and store the remainder in a variable 
	const timeDiff = moment().diff(firstTrainConverted, "minutes") % frequency;
	// calculate how many minutes away is the next train
	const minAway = frequency - timeDiff;
	// cacluated the train's next arrival
	const nextStop = moment().add(minAway, "m").format("hh:mm A");

  //display the pertinent information in the train schedule panel
   $("#train-table > tbody")
   .append(
		`<tr>
			<td>${train}</td>
			<td>${destination}</td>
			<td>${frequency} minutes</td>
			<td>${nextStop}</td>
			<td>${minAway}</td>
		</tr>`
   );
}); 