/********
mapFxns.js
********/



//used in making markers to check waypoints
function createMarker(place) {
  	var marker = new google.maps.Marker({
		map: map,
		position: place,
		animation: google.maps.Animation.BOUNCE
  	});
}

function createPlaceMarker(place) {
	var infoWindowContent = String(place.name);
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	numOfType++;

	startInfoWindow = new google.maps.InfoWindow({
		content: infoWindowContent
	});
	google.maps.event.addListener(marker, 'click', function() {
	    startInfoWindow.open(map,marker);
	});
}
