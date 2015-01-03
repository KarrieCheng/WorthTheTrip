/*

set starting Point
set ending Point

find mid point

catalogs all nearbyplaces (midpoint, distance from end/start point to middle point acts as radius)

*/
var map;
var infowindow;
var service;

var startPoint = new google.maps.LatLng(31.4614, -96.0631); //Hutto
var endPoint = new google.maps.LatLng(43.2500, -79.8667); //hamilton


// var startPoint = new google.maps.LatLng(31.4614, -96.0631); //Hutto
// var endPoint = new google.maps.LatLng(43.2500, -79.8667); //hamilton

/*City Coordinates

N'awwlins: 29.9667, -90.0500      
College Station: 30.6014, - 96.3144

it's a straightshot from Hutto to Buffalo
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
var placeType = "";
var placeType2 = "casino";
var numOfType = 0;

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


	// //start and end markers
	// var startMarker = new google.maps.Marker({
	// 	map: map,
	//     position: startPoint,
	//     title:"This is the start!"
	// });

	// var endMarker = new google.maps.Marker({
	// 	map: map,
	//     position: endPoint,
	//     title:"This is the end!"
	// });

	// startMarker.setAnimation(google.maps.Animation.DROP);
	// startMarker.setAnimation(google.maps.Animation.BOUNCE);

	// endMarker.setAnimation(google.maps.Animation.BOUNCE);


	//creates infoWindows at start/end locations
	//mainly for code reference purposes
	// startInfoWindow = new google.maps.InfoWindow({
	// 	content: "<h>Hello!</h><p>This is the starting position!!!</p>"
	// });
	// startInfoWindow.open(map,startMarker);
	// google.maps.event.addListener(startMarker, 'click', function() {
	//     startInfoWindow.open(map,startMarker);
	//   });

	// endInfoWindow = new google.maps.InfoWindow({
	// 	content: "End Position"
	// });
	// endInfoWindow.open(map,endMarker);

	//makes places requests possible to call
	service = new google.maps.places.PlacesService(map);
  	calcRoute();

  	//populatePlaces(coordArray,recRadiusArray); SHOULD be here but doesn't work because of threads
}

function distFromStart (legEnd) {
	return google.maps.geometry.spherical.computeDistanceBetween(startPoint,legEnd);
}
function distFromEnd (legEnd) {
	return google.maps.geometry.spherical.computeDistanceBetween(endPoint,legEnd);
}

function calcRoute() {

	//the following lines calculate the initial route
  var dirReq = {
      origin:startPoint,
      destination:endPoint,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives:true
  };

  //the following:
  //checks all the alternative routes and renders them
  //marks all the end points of all the legs except the last leg (so it's just the middle legs)
 	 directionsService.route(
	    dirReq,
	    function (response, status) {
	        if (status == google.maps.DirectionsStatus.OK) {
	        	//iterates through the routes
	            for (var i = 0, len = response.routes.length; i < len; i++) {

	            	//displays all routes
	                new google.maps.DirectionsRenderer({
	                    map: map,
	                    directions: response,
	                    routeIndex: i
	                });

	                // iterate through legs and set markers at the end of each leg.
	                for (var j = 0; j < response.routes[i].legs.length; j++){
	                	for (var k  = 0; k < response.routes[i].legs[j].steps.length; k++){
	                		var stepCoords = response.routes[i].legs[j].steps[k].end_location;

	                		
	                		//!!!reference to mark where the legs are for now
	                		//createMarker(stepCoords); 

	                		//~the indices for both the coordinate array and the recRadius should refer to the same point

	                		//array of coordinates should be able to cover the name, lat, lng, name, and rating
	                		coordArray.push(stepCoords);
	                		
	                		calcSrchRad(stepCoords);
	                		recRadiusArray.push(pushRadius);
	                	}
	                }
	            // console.log("Route " + i + " leg coordinates have been calculated.");
	            // console.log("The number of coordinates in coordarray is: "+coordArray.length);

	            // console.log("The number of radii in radiiArray is: "+recRadiusArray.length);
	            }
	        } else {
	            $("#error").append("Unable to retrieve your route<br/>");
	        }
	        populatePlaces(coordArray,recRadiusArray);
    	}
	);

	directionsService.route(dirReq, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
		  directionsDisplay.setDirections(response);
		}
	});
}


function calcSrchRad(coordinates){
	if ((distFromStart(coordinates) > distBetween) && (distFromEnd(coordinates) > distBetween)){
		distFromStart(coordinates)>distFromEnd(coordinates)?
			pushRadius = distFromEnd(coordinates)-distBetween : pushRadius = distFromStart(coordinates)-distBetween;

	}
	else if (distFromStart(coordinates)>distFromEnd(coordinates))
		pushRadius = distFromEnd(coordinates);
	else
		pushRadius = distFromStart(coordinates);

	//checks if any of these exceeds the 50km limit
	if (pushRadius > 50000)
		pushRadius = 50000;

	//you really don't want the radius to be that far off from the path
	pushRadius /= 2;
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
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++){
			createPlaceMarker(results[i]);
			console.log("Number of " + placeType + ": " + numOfType);
		}
	}
}


function createMarker(place) {
  	var marker = new google.maps.Marker({
		map: map,
		position: place,
		animation: google.maps.Animation.BOUNCE
  	});
  // 	google.maps.event.addListener(marker, 'click', function() {
		// infowindow.setContent(place.name);
		// infowindow.open(map, this);
  // 	});
}

function createPlaceMarker(place) {
	var infoWindowContent = String(place.name);
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	// google.maps.event.addListener(marker, 'click', function() {
	// 	infowindow.setContent(place.name);
	// 	infowindow.open(map, this);
	// });
	numOfType++;

	startInfoWindow = new google.maps.InfoWindow({
		content: infoWindowContent
	});
	google.maps.event.addListener(marker, 'click', function() {
	    startInfoWindow.open(map,marker);
	});
}

google.maps.event.addDomListener(window, 'load', initialize);