 /**
 * George Nelson Furniture:
 * Cigar Lamp
 **/

/**
 * Util functions:
 */

var DUPLIROT = function(axis){
	/*
	Rotate end create n copies of an hpc object.
	Usage: DUPLIROT([axis, axis])(angle)(object)(number)
	e.g.: DRAW(STRUCT(AA(POLYLINE)(DUPLIROT([1,3])(PI/6)(obj)(3))))
	*/
	// In python it was a oneliner... :(
	return function(alpha){ return function(obj){ return function(n){
		var res = [];
		for (var i = 0; i < n; i++)
			res.push(R(axis)(alpha*i)(obj));
		console.log(res);
		return STRUCT(res);
	} } }
};

var ROTATIONAL_SOLID = function(points){
	/*
	Similar to ROTATIONAL_SURFACE but takes points, not curves.
	*/
	return function(angle){ return function(divs){
		var domain = PROD1x1([INTERVALS(points.length-1)(points.length-1), INTERVALS(angle)(divs)]);
		var profile = function(x) { return points[x[0]];}
		return MAP(ROTATIONAL_SURFACE(profile))(domain);
	}}
};


/* ***Cigar Lamp*** */
// Measurements: H 63.5" Diameter 10"

var lampBase = ROTATIONAL_SOLID([[0,0,.3],[3,0,.3],[3,0,0],[4.5,0,0],[4.5,0,.3],[6,0,.3],[6,0,.6],[.3,0,.6],[.3,0,45.9],[2.5,0,45.9],[2.5,0,46],[.3,0,46],[.3,0,63.4],[2.5,0,63.4],[2.5,0,63.5],[0,0,63.5]])(2*PI)(64);
var shadeCP = [[2,0,46],[3,0,46],[3,0,46],[6,0,50.2],[6,0,59.2],[3,0,63.4],[3,0,63.4],[2,0,63.4]];
var shade = STRUCT([
	COLOR([1.5,1.5,1.5])(MAP(ROTATIONAL_SURFACE(NUBS(S0)(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP)))(PROD1x1([INTERVALS(1)(64), INTERVALS(2*PI)(32)]))),
	COLOR([.5,.5,.5,.5])(DUPLIROT([0,1])(PI/16)(NUBSPLINE(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP))(32))
]);
var lamp = STRUCT([lampBase, shade]);

DRAW(lamp);
