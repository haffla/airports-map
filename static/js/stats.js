var data;
var statsName;
var hist = {};
var clicked = false;

function getStatistics() {
	if(clicked) return;
	
	$("#stats").css("display", "block");
	clicked = true;
	
	$.each(hist, function(key, res) {
		hist[key] = 0 ;
	});
	
	//set variables for current airport type
	switch(currentMode) {
	case 1:
		data = airports_small;
		statsName = "all Small Airports:";
		break;
		
	case 2:
		data = airports_medium;
		statsName = "all Medium Airports:";
		break;
		
	case 3:
		data = airports_large;
		statsName = "all Large Airports:";
		break;
	}
	
	//do some stats calculation
	var iataCount = 0;
	var avg_height = 0;
	
	for(var i = 0; i < data.length; i++) {
		if(data[i]) {
			if(data[i].airport.iata_code) iataCount++;
			avg_height += data[i].airport.elevation_ft;
			hist[data[i].airport.iso_country]++;
		}
	}
	
	//convert from ft to meters
	avg_height = (avg_height / airports_count) * 0.3048;
	
	$("#statsName").html("Statistics for " + statsName);
	$("#statsContainer").append("<br><li>Airports counted worldwide: \n" + airports_count + "</li>");
	$("#statsContainer").append("<li>Airports with IATA codes: \n" + iataCount + "</li>");
	$("#statsContainer").append("<li>Average height above sea level: \n" + Math.round(avg_height) + "m</li>");
	$("#statsContainer").append("<br><li>Amount of airports by location:</li>");
	
	//pick the top five locations with the most airports
	$.each(hist, function(key, res) {
		if(res != 0) $("#statsOverview").append("<li>" + countries[key] + ": " + hist[key] + "</li>");
	})
}

function hideStats() {
	$("#stats").css("display", "none");
	$("#statsName").html("");
	$("#statsContainer").html("");
	$("#statsOverview").html("");
	
	clicked = false;
}