/*
set starting Point
set ending Point

find mid point

catalogs all nearbyplaces (midpoint, distance from end/start point to middle point acts as radius)

*/
var map;
var infowindow;
var service;

var startPoint = new google.maps.LatLng(30.4382899,-97.7340018); 
var endPoint = new google.maps.LatLng(29.9667, -90.0500);

/*City Coordinates
N'awwlins: 29.9667, -90.0500      
College Station: 30.6014, - 96.3144
Hutto: 30.5444, -97.5453
Buffalo, Tx: 31.4614, -96.0631
Hamilton, ON: 43.2500, -79.8667
austin 30.4382899,-97.7340018
*/
var pushRadius = 20000;

var midLat = (endPoint.lat()+startPoint.lat())/2;
var midLng = (endPoint.lng()+startPoint.lng())/2;
var midPoint = new google.maps.LatLng(midLat, midLng);
var distBetween = google.maps.geometry.spherical.computeDistanceBetween(startPoint,midPoint);

var coordArray = []; //array for the coordinates of waypoints
var recRadiusArray = []; //recommended radii for each waypoint

//variable checks for the callback function
var placeType = "city_hall";
var placeType2 = "casino";
var numOfType = 0;
var placeHash = new Hashtable(); //key is the latlong coordinates, value is the object that it is coming from

var directionsDisplay; //Shows map with directions
var directionsService = new google.maps.DirectionsService(); 



function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();

	//sets the map
	var mapOptions = {
		zoom:8,
		center: midPoint
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


//begin autocomplete
	var StartInput = /** @type {HTMLInputElement} */(
	document.getElementById('start-input'));

	var EndInput = /** @type {HTMLInputElement} */(
	document.getElementById('end-input'));

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(StartInput);
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(EndInput);

	var autocompleteStart = new google.maps.places.Autocomplete(StartInput);
	autocompleteStart.bindTo('bounds', map);
	var autocompleteEnd = new google.maps.places.Autocomplete(EndInput);
	autocompleteEnd.bindTo('bounds', map);

	var infowindow = new google.maps.InfoWindow();
	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	google.maps.event.addListener(autocompleteStart, 'place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocompleteStart.getPlace();
			if (!place.geometry) {
			  return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
		  map.fitBounds(place.geometry.viewport);
		} else {
		  map.setCenter(place.geometry.location);
		  map.setZoom(17);  // Why 17? Because it looks good.
		}
	});
//end auto complete

	//makes places requests possible to call
	service = new google.maps.places.PlacesService(map);
  	calcRoute();
  	//populatePlaces(coordArray,recRadiusArray); SHOULD be here but doesn't work because of threads
  	//placeHash.each(function(){console.log("place test");}); SAME as above; function is to test
  	//placeHash.each(function(){createMarker(key.location);});

  	//FIND A WAY TO THE PROGRAM LOCK UNTIL THE REQUESTS ARE COMPLETED

  	window.setTimeout(function () {
  		placeHash.each(function(key,value){
  			createPlaceMarker(value);});
  	}, 5000);


}


 //for every single waypoint, checks wanted places
function populatePlaces(coordinateArray, radiiArray){
	for (var i = 0; i < coordinateArray.length ; i++){
		var nearbyPlaceHolder = new google.maps.LatLng(coordinateArray[i].lat(), coordinateArray[i].lng());
		//console.log("Waypoint" + i + "; Coordinates: "+nearbyPlaceHolder);
		var request = {
		    location: nearbyPlaceHolder,
		    radius: String(radiiArray[i]),
		    //radius: radiiArray[i],
		    types: [placeType, placeType2]
		};

		service.nearbySearch(request, callback);
	}
	//placeHash.each(function(){console.log("place test");}); 
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {//3!!!!!!!!!!!!!
		for (var i = 0; i < results.length; i++){
			placeHash.put(results[i].geometry.location, results[i]);
			console.log("Size of placeHash: " + placeHash.size());
			console.log("Number of " + placeType + ": " + numOfType);
		}
	}
}

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

	infowindow = new google.maps.InfoWindow({
		content: infoWindowContent
	});
	google.maps.event.addListener(marker, 'click', function() {
	   infowindow.open(map,marker);
	});
}

google.maps.event.addDomListener(window, 'load', initialize);