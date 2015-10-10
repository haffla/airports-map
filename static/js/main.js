var map;
var token;
var markers = [];

$(function() {
	token = L.mapbox.accessToken = "pk.eyJ1IjoiY29ycm9kaXplIiwiYSI6IkN4ZTAtZFUifQ.30pfMZ3Nqd5mJoLIrQ19uQ";
	map = L.mapbox.map("map", "corrodize.j40899hk");

	var markerLayerGroup = L.layerGroup().addTo(map);

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
		$('#markers_count').html(Object.keys(airports).length);

	  var markerArray = [];
	  for (var key in airports){
	  	var airport = airports[key];
	    var wiki = (airport.wikipedia_link != 0) ? "<a target=\"_blank\" href=" + airport.wikipedia_link + ">Wikipedia</a><br>" : "";
			var home = (airport.home_link != 0) ? "<a target=\"_blank\" href=" + airport.home_link + ">Website</a>" : "";
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

});
