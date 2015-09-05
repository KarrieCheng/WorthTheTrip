/********
circleMapMaker.js
********/
var map;
var infowindow;
var service;

var startPoint = new google.maps.LatLng(29.9667, -90.0500 ); 
var endPoint = new google.maps.LatLng(30.6014, - 96.3144);

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
var placeType = "casino";
var placeType2 = "university";
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

	//makes places requests possible to call
	service = new google.maps.places.PlacesService(map);
  	calcRoute();
  	//populatePlaces(coordArray,recRadiusArray); SHOULD be here but doesn't work because of threads
  	//placeHash.each(function(){console.log("place test");}); SAME as above; function is to test
  	//placeHash.each(function(){createMarker(key.location);});

  	//FIND OUT HOW TO PROMISE CHAIN
  	window.setTimeout(function () {
  		placeHash.each(function(key,value){
  			createPlaceMarker(value);});
  	}, 2000);


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

			/*TD: check if in hash
				if not, create a new place 
				
				*/
			//MOVETOMAIN 
			//createPlaceMarker(results[i]);

			placeHash.put(results[i].geometry.location, results[i]);
			console.log("Size of placeHash: " + placeHash.size());
			console.log("Number of " + placeType + ": " + numOfType);
		}
	}
}


google.maps.event.addDomListener(window, 'load', initialize);