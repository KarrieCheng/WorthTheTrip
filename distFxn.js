/*holds distance functions--
distFromStart()
distFromEnd()
calcRoute()
calcSrchRad()
*/
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
	        if (status == google.maps.DirectionsStatus.OK) { //1!!!!!!!!!!!!!
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
		if (status == google.maps.DirectionsStatus.OK) {//2!!!!!!!!!!!!!
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

	//you really don't want the radius to be that far off from the path
	pushRadius /= 3;

	//checks if any of these exceeds the 50km limit
	if (pushRadius > 50000)
		pushRadius = 50000;
}
