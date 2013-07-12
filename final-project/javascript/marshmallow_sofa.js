 /**
 * George Nelson Furniture:
 * Cigar Lamp
 **/

/**
 * Util functions:
 */

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

var TORUS = function (R, r) {
	return function(v) {
		var a = v[0];
		var b = v[1];
		var u = (r * COS(a) + R) * COS(b);
		var v = (r * COS(a) + R) * SIN(b);
		var w = r * SIN(a);
		return [u, v, w];
	}
};

var BLACK = COLOR([0,0,0]);

/* ***Marshmallow Sofa*** */
// Measurements: H 31" D 29" W 52" Seat H 16"

//Pillow:
var pillowCP = [[0,0,0],[0,0,0],[4.8,0,0],[5,0,.2],[5,0,1.9],[4.8,0,2],[5,0,2],[5,0,2.2],[4.8,0,2.2],[4.9,0,2],[4.5,0,2.7],[0,0,2.7],[0,0,2.7]];
var pillow1 = MAP(ROTATIONAL_SURFACE(NUBS(S0)(3)([0,0,0,0,2,3,4,5,6,7,8,9,10,12,12,12,12])(pillowCP)))(PROD1x1([INTERVALS(1)(32), INTERVALS(2*PI)(32)]));
var pillow2 = ROTATIONAL_SOLID([[4.8,0,.2],[4.8,0,-.1],[1.2,0,-.1],[1.2,0,-.3],[.5,0,-.3],[.5,0,-2]])(2*PI)(32);
var pillowBolt = ROTATIONAL_SOLID([[.2,0,-3.2],[.2,0,-3.5],[.15,0,-3.5],[.15,0,-3.3],[0,0,-3.3]])(2*PI)(6);

// colored:
var ligthPillow = STRUCT([COLOR([231/255, 225/255, 209/255])(pillow1), pillow2, pillowBolt]);
var darkPillow = STRUCT([COLOR([88/255, 62/255, 49/255])(pillow1), pillow2, pillowBolt]);

var pillowRow = function(n){
	var pillows = [];
	for (var i = 0; i < n; i++){
		pillows.push(T([0])([10.4*i])((i%2===0?darkPillow:ligthPillow)));
	};
	return STRUCT(pillows);
};

var row1 = STRUCT([ligthPillow, T([0])([10.4])(pillowRow(3)), T([0,1,2])([-2,-.6,-3.2])(CUBOID([35.2,1.2,1.2]))]);
var row2 = STRUCT([T([0,1,2])([-2,-.6,-3.2])(CUBOID([45.6,1.2,1.2])), ligthPillow, T([0])([10.4])(pillowRow(4))]);
var row3 = STRUCT([T([0,1,2])([-2,-.6,-3.2])(CUBOID([45.6,1.2,1.2])), pillowRow(5)]);
var row4 = STRUCT([T([0,1,2])([-2,-.6,-3.2])(CUBOID([35.2,1.2,1.2])), pillowRow(4)]);

var pillowRows = STRUCT([
	T([2])([16.5])(R([1,2])(-PI/2)(STRUCT([row1, T([0,1])([-5,9])(row2)]))),
	T([1])([16.5])(STRUCT([T([0,1])([-5,-9])(row3), row4]))
]);

// Structure:
var sofaStructure1 = BLACK(MAP(TORUS(10,.5))(PROD1x1([INTERVALS(2*PI)(12), INTERVALS(PI/2)(12)])));
var sofaStructure2 = BLACK(T([1])([10])(R([0,2])(-PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,12],[.4,0,12.1],[0,0,12.1]])(2*PI)(12))));
var sofaStructure3 = BLACK(T([0])([10])(R([1,2])(PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,12],[.4,0,12.1],[0,0,12.1]])(2*PI)(12))));
var sofaStructureLeg1 = BLACK(T([0,1])([-5,10])(R([1,2])(-PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,10], [0,0,10]])(2*PI)(12))));
var sofaStructureLeg2 = BLACK(T([0,1])([17.5,15])(R([0,1])(-PI/6)(R([1,2])(PI/2)(ROTATIONAL_SOLID([[0,0,-.2],[.5,0,-.2],[.5,0,15.5]])(2*PI)(12)))));
var sofaStructure40 = T([2])([.7])(R([0,2])(PI/2)(STRUCT([
	T([0,1])([.7,.7])(ROTATIONAL_SOLID([[0,0,1.5],[.2,0,1.5],[.2,0,-.1],[0,0,-.1]])(2*PI)(6)), 
	BLACK, T([1])([1.3])(CUBOID([1.4,.1,1.4])), CUBOID([1.4,1.4,.1]), 
	T([2])([1.3])(BLACK(CUBOID([1.4,1.4,.1])))])));
var sofaStructure4 = STRUCT([
	T([0,1])([8.5,-.5])(R([0,1])(-PI/2)(sofaStructure40)), 
	T([0,1])([8.5,-9.5])(R([0,1])(-PI/2)(sofaStructure40)),
	T([0,1])([-1.9,8.5])(sofaStructure40),
	T([0,1])([-10.9,8.5])(sofaStructure40)
]);

var sofaStructure = T([0,1,2])([2.5,6.3,6.3])(R([1,2])(-PI/2)(R([0,2])(PI/2)(STRUCT([sofaStructure1, sofaStructure2, sofaStructure3, sofaStructure4, sofaStructureLeg1, sofaStructureLeg2]))));
var sofaStructure = STRUCT([sofaStructure, T([0])([26.2])(sofaStructure)]);

var sofaFoot1 = T([0,1])([2.5,13.9])(ROTATIONAL_SOLID([[0,0,0],[.4,0,0],[.5,0,.1],[.1,0,.3],[.1,0,.9]])(2*PI)(24));
var sofaFoot2 = T([0,1])([2.5,-9.2])(ROTATIONAL_SOLID([[0,0,0],[.4,0,0],[.5,0,.1],[.1,0,.3],[.1,0,.9]])(2*PI)(24));

var sofaFoots = STRUCT([sofaFoot1, sofaFoot2, T([0])([26.2]), sofaFoot1, sofaFoot2]);

var sofa = STRUCT([sofaFoots, T([2])([11.5])(R([1,2])(PI/15)(STRUCT([sofaStructure, pillowRows])))]);

DRAW(sofa);
