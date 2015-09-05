/********
distanceFxns.js
********/

function distFromStart (legEnd) {
	return google.maps.geometry.spherical.computeDistanceBetween(startPoint,legEnd);
}

function distFromEnd (legEnd) {
	return google.maps.geometry.spherical.computeDistanceBetween(endPoint,legEnd);
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