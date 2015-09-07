/********
circleMapMaker.js
********/
var map;
var infowindow;
var service;

/******************
City Coordinates
----------------
N'awwlins: 29.9667, -90.0500      
College Station: 30.6014, - 96.3144
Dallas: 32.8206645,-96.7313396
Hutto: 30.5444, -97.5453
Buffalo, Tx: 31.4614, -96.0631
Hamilton, ON: 43.2500, -79.8667
austin 30.4382899,-97.7340018
******************/

var startPoint = new google.maps.LatLng(43.2500, -79.8667); 
var endPoint = new google.maps.LatLng(30.6014, - 96.3144);

var pushRadius = 20000;

var midLat = (endPoint.lat()+startPoint.lat())/2;
var midLng = (endPoint.lng()+startPoint.lng())/2;
var midPoint = new google.maps.LatLng(midLat, midLng);
var distBetween = google.maps.geometry.spherical.computeDistanceBetween(startPoint,midPoint);

var coordArray = [];        //array for the coordinates of waypoints
var recRadiusArray = [];    //recommended radii for each waypoint

//variable checks for the callback function
var placeType = "zoo";
var placeType2 = "university";
var numOfType = 0;
var placeHash = new Hashtable(); //key is the latlong coordinates, value is the object that it is coming from

var directionsDisplay; //Shows map with directions
var directionsService = new google.maps.DirectionsService(); 



function initialize(){
	directionsDisplay = new google.maps.DirectionsRenderer();

	//sets the map
	var mapOptions = {
		zoom:8,
		center: midPoint
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//makes places requests possible to call
	service = new google.maps.places.PlacesService(map);
    
    //CALC ROUTE SHOULD BE JUST GET WAYPOINTS; REDO this whole function
  	calcRoute();

    //FIND OUT HOW TO PROMISE CHAIN
  	//populatePlaces(coordArray,recRadiusArray); SHOULD be here but doesn't work because of threads
  	
    
    //this is only here because we gotta 
  	window.setTimeout(function(){
  		placeHash.each(function(key,value){
  			createPlaceMarker(value);});
  	}, 2000);
}

function callback(results, status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {//3!!!!!!!!!!!!!
		for (var i = 0; i < results.length; i++){
            placeHash.put(results[i].geometry.location, results[i]);
		}
	}
}


google.maps.event.addDomListener(window, 'load', initialize);