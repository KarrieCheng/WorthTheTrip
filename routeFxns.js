/********
routeFxns.js
********/

//KC: This whole entire function should just return an array of waypoints instead.
function calcRoute() {

	//the following lines calculate the initial route
  var dirReq = {
      origin:startPoint,
      destination:endPoint,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives:true
  };

 	 directionsService.route(
	    dirReq,
	    function (response, status) {
	        if (status == google.maps.DirectionsStatus.OK) { //1!!!!!!!!!!!!!
	        	//iterates through the routes
	            for (var i = 0, len = response.routes.length; i < len; i++) {

	            	//FOR DEBUGGING PURPOSES: displays all routes
	                new google.maps.DirectionsRenderer({
	                    map: map,
	                    directions: response,
	                    routeIndex: i
	                });

	                // iterate through legs and set markers at the end of each leg.
                    // skips the last leg because that's the destination
	                for (var j = 0; j < response.routes[i].legs.length; j++){
	                	for (var k  = 0; k < response.routes[i].legs[j].steps.length; k++){
                            var stepCoords = response.routes[i].legs[j].steps[k].end_location;

                            coordArray.push(stepCoords);

                            calcSrchRad(stepCoords);
                            recRadiusArray.push(pushRadius);
	                	}
	                }
	            }
	        } else {
	            $("#error").append("Unable to retrieve your route<br/>");
	        }
	        populatePlaces(coordArray,recRadiusArray);
    	}
	);

	directionsService.route(dirReq, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {//2!!!!!!!!!!!!!
		  directionsDisplay.setDirections(response);
		}
	});
}

 //for every single waypoint, checks wanted places
function populatePlaces(coordinateArray, radiiArray){
	for (var i = 0; i < coordinateArray.length ; i++){
		var nearbyPlaceHolder = new google.maps.LatLng(coordinateArray[i].lat(), coordinateArray[i].lng());
        var request = {
		    location: nearbyPlaceHolder,
		    radius: String(radiiArray[i]),
		    types: [placeType, placeType2]
		};
		service.nearbySearch(request, callback);
	}
}