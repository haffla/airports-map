var map;
var token;
var airports_simple = [];
var markers = [];
var countries = {};

$(function() {
	token = L.mapbox.accessToken = "pk.eyJ1IjoiY29ycm9kaXplIiwiYSI6IkN4ZTAtZFUifQ.30pfMZ3Nqd5mJoLIrQ19uQ";
	map = L.mapbox.map("map", "corrodize.j40899hk");

	$('.modeToggle').on('click', function(event) {
		getPins($(this).val());
		console.log($(this).data('a'));
	});

	var markerLayerGroup = L.layerGroup().addTo(map);

	map.on("click", function() {
		hideStats();
	});

	map.on('dragend', getPins);
	map.on('zoomend', getPins);

	function getPins(){
	  $("#loader").css("display", "block");
	  bounds = map.getBounds();
	  url = "within?lat1=" + bounds.getSouthWest().lat + "&lon1="
						+ bounds.getSouthWest().lng + "&lat2=" + bounds.getNorthEast().lat
						+ "&lon2=" + bounds.getNorthEast().lng;
	  $.get(url, pinTheMap, "json");
	}

	function pinTheMap(data){
	  var airports = $.parseJSON(data);
	  map.removeLayer(markers);
		$('#markers_count').html(data.length);

	  var markerArray = [];
	  for (var key in airports){
	  	var airport = airports[key];
	    var wiki = airport.wikipedia_link ? "<a target=\"_blank\" href=" + airport.wikipedia_link + ">Wikipedia</a><br>" : "";
		var home = airport.home_link ? "<a target=\"_blank\" href=" + airport.home_link + ">Website</a>" : "";
	    var marker = L.marker([airport.latitude_deg, airport.longitude_deg]).bindPopup(
						"<strong>" + airport.name + "</strong><br>" +
						"<strong>City: </strong>" + airport.municipality + "<br>" +
						"<strong>Country: </strong>" + airport.iso_country + "<br>" +
						"<strong>Elevation: </strong>" + Math.round(airport.elevation_ft * 0.3048) + "m<br>" +
						"<strong>IATA Code: </strong>" + airport.iata_code + "<br>" +
						wiki +
						home
					);
	    markerArray.push(marker);
	  }
	  markers = new L.MarkerClusterGroup();

	  $.each(markerArray, function(key, res) {
	  	markers.addLayer(res);
	  })

  	map.addLayer(markers);
	  $("#loader").css("display", "none");

	}

	// function setupData() {
	//
	// 	$.getJSON('static/res/countries.json', function(data) {
	// 		$.each(data, function (key, res) {
	// 			countries[key] = res;
	// 			hist[key] = 0;
	// 		});
	// 	});
	// 
	// 	//load airports json
	// 	$.getJSON('static/res/airports_withoutheliports.json', function(data) {
	// 		var l = data.length
	// 		for(var i = 0; i < l; i++) {
	// 			res = data[i];
	//
	// 			var wiki = res.wikipedia_link ? "<a target=\"_blank\" href=" + res.wikipedia_link + ">Wikipedia</a><br>" : "";
	// 			var home = res.home_link ? "<a target=\"_blank\" href=" + res.home_link + ">Website</a>" : "";
	//
	// 			var fdata = {
	// 				airport: res,
	// 				marker: L.marker([res.latitude_deg, res.longitude_deg], {
	// 					icon: L.mapbox.marker.icon({
	// 						"marker-size": "medium",
	// 						"marker-symbol": "airport"
	// 					})
	// 				}).bindPopup(
	// 					"<strong>" + res.name + "</strong><br>" +
	// 					"<strong>City: </strong>" + res.municipality + "<br>" +
	// 					"<strong>Country: </strong>" + countries[res.iso_country] + "<br>" +
	// 					"<strong>Elevation: </strong>" + Math.round(res.elevation_ft * 0.3048) + "m<br>" +
	// 					"<strong>IATA Code: </strong>" + res.iata_code + "<br>" +
	// 					wiki +
	// 					home
	// 				)
	// 			}
	//
	// 			if(res.type === "small_airport") {
	// 				airports_small[res.id] = fdata;
	// 			} else if(res.type === "medium_airport") {
	// 				airports_medium[res.id] = fdata;
	// 			} else {
	// 				airports_large[res.id] = fdata;
	// 			}
	// 			var autocomplete = "";
	//
	// 			if(res.name) autocomplete += res.name;
	// 			if(res.iata_code) autocomplete += " (" + res.iata_code + ")";
	// 			if(res.municipality) autocomplete += ", " + res.municipality;
	// 			if(res.iso_country) autocomplete += ", " + countries[res.iso_country];
	//
	// 			airports_simple[res.id] = autocomplete;
	// 		}
	//
	// 		setMode(3);
	// 		wasMode = null;
	// 		setMarkers();
	//
	// 		$("#search_input").autocomplete({
	// 			source: _.values(airports_simple), //fill autocomplete with values of airports_simple
	// 			minLength: 3,
	// 			select: function( event, ui )
	// 					{
	// 						var selected = ui.item.value; //value of selected item
	// 						var airp_id = (_.invert(airports_simple))[selected]; //get id of that airport by inverting hash
	// 						if(airp_id in airports_small) {
	// 		 					panToMarker(airp_id, airports_small);
	// 		 				}
	// 		 				else if (airp_id in airports_medium) {
	// 		 					panToMarker(airp_id, airports_medium);
	// 		 				}
	// 		 				else{
	// 		 					panToMarker(airp_id, airports_large);
	// 		 				}
	// 					}
	//
	// 		});
	//
	// 		console.log(new Date().getTime() - before);
	//
	// 	});
	//
	//
	//
	// }
	//
	//
	//
	// function setMode(value) {
	// 	wasMode = currentMode;
	// 	currentMode = value;
	// 	$('.modeToggle').removeClass('active');
	// 	if(value == 1) {
	// 		$('#toggle_small').addClass('active');
	// 		$('#airport_feedback').html('Small Airports');
	// 	}
	// 	else if(value == 2) {
	// 		$('#toggle_medium').addClass('active');
	// 		$('#airport_feedback').html('Medium Airports');
	// 	}
	// 	else {
	// 		$('#toggle_large').addClass('active');
	// 		$('#airport_feedback').html('Large Airports');
	// 	}
	// }
	//
	// function panToMarker(airp_id, airports_array) {
	// 	var lati = airports_array[airp_id].marker._latlng.lat;
	// 	var longi = airports_array[airp_id].marker._latlng.lng;
	// 	map.panTo(new L.LatLng(lati, longi));
	// 	map.setZoom(10);
	//  }

});
