 /**
 * George Nelson Furniture:
 * Platform Bench
 **/

/**
 * Util functions:
 */

var MIRROR = function (axis){
	/**
	 * reflect an object along an axis
	 */
	return function (obj) {return STRUCT([obj, S([axis])([-1])(obj)])}
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

var MKRECT = function (points) {
	/**
	 * given four verts, create a rect
	 **/
	return MAP(BEZIER(S1)([BEZIER(S0)([points[0],points[1]]),BEZIER(S0)([points[2],points[3]])]))(PROD1x1([INTERVALS(1)(1), INTERVALS(1)(1)]));
};

/* ***Platform Bench*** */
// Measurements: H 14" D 18.5" W 48"

// MKPOL...
var benchFoot = R([1,2])(-PI/2)(ROTATIONAL_SOLID([[0,0,-.15],[.6,0,-.15],[.6,0,0]])(2*PI)(24));
var benchBase1 = (MKRECT([[0,12],[9.25,12],[0,11.25],[8.25,11.25]]));
var benchBase2 = (MKRECT([[9.25,12],[8.25,11.5],[7,0],[6.25,.75]]));
var benchBase3 = (MKRECT([[0,0],[0,.75],[7,0],[6.25,.75]]));
var benchBase = EXTRUDE([2])(STRUCT([benchBase1, benchBase2, benchBase3]));
benchBase = STRUCT([COLOR([.1,.1,.1]), T([0,2])([5,1])(benchFoot), benchBase]);
// mirror the base along the y-axis:
benchBase = R([1,2])(PI/2)(T([0,1,2])([9.25,.3,-9])(STRUCT(REPLICA(2)([MIRROR(0)(benchBase), T([2])([-32])]))));

//11*.7+12*.9 = 18.5
var rods = STRUCT(REPLICA(12)([CUBOID([.9, 48,2]), T([0])([1.6])]));
// to prevent graphic glitches, perpendicular rods (prods) don't touch rods:
var prods = STRUCT(REPLICA(11)([T([0])([.9]), CUBOID([.7, 1, 2]), T([0])([.7])]));
prods = STRUCT(REPLICA(2)([prods, T([1])([23])]));
prods = T([1])([24])(MIRROR(1)(prods));

var bench = STRUCT([benchBase, COLOR([250/255, 210/255, 131/255]), T([2])([12.3]), prods, rods]);

DRAW(bench);
