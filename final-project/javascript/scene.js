/**
 * George Nelson Furniture:
 * Modeling of a scene made up of Nelson's furniture
 * http://en.wikipedia.org/wiki/George_Nelson_(designer)
 **/


/**
 * Util functions:
 */

var AAPOINTS = function(func){
	/*
	Apply a function to all points
	usage:
	AAPOINTS(func)(parameters)(points)
	e.g.: AAPOINTS(SUM)([1,.3,10])([[0,0,0],[1,0,3],[2,0,9]])
	*/
	return function(operands){ return function(args){ return AA(function(list){
		var res = [];
		for (var i = 0; i < list.length; i++)
			res.push(func([operands[i],list[i]]));
		return res;
	})(args);}}
};

var MIRROR = function (axis){
	/**
	 * reflect an object along an axis
	 */
	return function (obj) {return STRUCT([obj, S([axis])([-1])(obj)])}
};

var DUPLIROT = function(axis){
	/*
	Rotate end create n copies of an hpc object.
	Usage: DUPLIROT([axis, axis])(angle)(object)(number)
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

var MKRECT = function (points) {
	/**
	 * given four verts, create a rect
	 **/
	return MAP(BEZIER(S1)([BEZIER(S0)([points[0],points[1]]),BEZIER(S0)([points[2],points[3]])]))(PROD1x1([INTERVALS(1)(1), INTERVALS(1)(1)]));
};

var BLACK = COLOR([0,0,0]);

/* Furniture chosen:
 *  - Cigar Lamp
 *  - Marshmallow Sofa
 *  - Platform bench
 *  - sunflower clock
 */

/* ***Cigar Lamp*** */
// Measurements: H 63.5" Diameter 10"
var lampBase = ROTATIONAL_SOLID([[0,0,.3],[3,0,.3],[3,0,0],[4.5,0,0],[4.5,0,.3],[6,0,.3],[6,0,.6],[.3,0,.6],[.3,0,45.9],[2.5,0,45.9],[2.5,0,46],[.3,0,46],[.3,0,63.4],[2.5,0,63.4],[2.5,0,63.5],[0,0,63.5]])(2*PI)(64);
var shadeCP = [[2,0,46],[3,0,46],[3,0,46],[6,0,50.2],[6,0,59.2],[3,0,63.4],[3,0,63.4],[2,0,63.4]];
var shade = STRUCT([
	COLOR([1.5,1.5,1.5])(MAP(ROTATIONAL_SURFACE(NUBS(S0)(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP)))(PROD1x1([INTERVALS(1)(64), INTERVALS(2*PI)(32)]))),
	COLOR([.5,.5,.5,.5])(DUPLIROT([0,1])(PI/16)(NUBSPLINE(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP))(32))
]);
var lamp = STRUCT([lampBase, shade]);

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

/* ***Sunflower Clock*** */
// Measurements: Diameter 29.5" D 3"

// There are 24 petals...
var petalCP1 = [[14.75,0] ,[13,0],[COS(PI/24)*12.6,SIN(PI/24)*12.6-.1],[COS(PI/24)*10.75, SIN(PI/24)*10.75-.1]];
var petalCP2 = [[COS(PI/24)*10.75, SIN(PI/24)*10.75-.1],[COS(PI/24)*9.5, SIN(PI/24)*9.5-.1],[8.5,0],[7.75, 0]];
var petalCP3 = [[7.75, 0],[6.5,0],[COS(PI/24)*6, SIN(PI/24)*6-.1],[COS(PI/24)*5.25, SIN(PI/24)*5.25-.1]];
var petalCP4 = [[COS(PI/24)*5.25, SIN(PI/24)*5.25-.1],[COS(PI/24)*4.25, SIN(PI/24)*4.25-.1],[3.5,0],[2, 0]];

var petalCPs = [petalCP1, petalCP2, petalCP3, petalCP4];

var petals = R([1,2])(-PI/2)(COLOR([238/255,118/255,0])(DUPLIROT([0,1])(PI/12)(MIRROR(1)(EXTRUDE([1])(STRUCT(AA(function (points){return MAP(BEZIER(S1)([BEZIER(S0)(points), BEZIER(S0)(AAPOINTS(SUM)([0,.1])(points))]))(PROD1x1([INTERVALS(1)(24), INTERVALS(1)(1)]))})(petalCPs)))))(24)));

var cyls = R([1,2])(-PI/2)(DUPLIROT([0,1])(PI/6)(T([0,2])([7.75,.5])(EXTRUDE([.8])(DISK(.15)(32))))(12));

var clockCenter = COLOR([.1,.1,.1])(R([1,2])(-PI/2)(STRUCT([
	ROTATIONAL_SOLID([[0,0,.1],[2.5,0,.1],[2.5,0,.7]])(2*PI)(64),
	MAP(ROTATIONAL_SURFACE(BEZIER(S0)([[2.5,0,.7],[2.5,0,.8],[2.4,0,.8]])))(PROD1x1([INTERVALS(1)(6), INTERVALS(2*PI)(64)])),
	ROTATIONAL_SOLID([[2.4,0,.8],[1.8,0,.8],[1.8,0,1]])(2*PI)(64),
	MAP(ROTATIONAL_SURFACE(BEZIER(S0)([[1.8,0,1],[1.8,0,1.1],[1.7,0,1.1]])))(PROD1x1([INTERVALS(1)(6), INTERVALS(2*PI)(64)])),
	ROTATIONAL_SOLID([[1.7,0,1.1],[0,0,1.1]])(2*PI)(64)
])));

var WHITE = COLOR([2,2,2]);

var clockPin = WHITE(R([1,2])(-PI/2)(ROTATIONAL_SOLID([[.1,0,1],[.1,0,1.3],[.2,0,1.3],[.1,0,1.4],[0,0,1.4]])(2*PI)(32)));

// EXTRUDE doesn't work...
var minuteHand = WHITE(T([1])([1.25])(MIRROR(1)(STRUCT([
	MKRECT([[-.1,0,7.5],[-.1,.05,7.5],[.1,0,7.5],[.1,.05,7.5]]),
	MIRROR(0)(MKRECT([[.1,0,7.5],[.1,.05,7.5],[.2,0,5],[.2,.05,5]])),
	MIRROR(0)(MKRECT([[.2,0,5],[.2,.05,5],[.2,0,-1.2],[.2,.05,-1.2]])),
	MIRROR(0)(MAP(BEZIER(S1)([BEZIER(S0)([[.2,0,-1.2],[1,0,-1.2],[1,0,-2.4],[0,0,-2.4]]), BEZIER(S0)([[.2,.05,-1.2],[1,.05,-1.2],[1,.05,-2.4],[0,.05,-2.4]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(4)]))),
	T([1])([.05]),
	ROTATIONAL_SOLID([[.1,0,7.5],[.2,0,5],[.2,0,-1.2]])(2*PI)(2),
	MAP(ROTATIONAL_SURFACE(BEZIER(S0)([[.2,0,-1.2],[1,0,-1.2],[1,0,-2.4],[0,0,-2.4]])))(PROD1x1([INTERVALS(1)(32), INTERVALS(2*PI)(2)]))
]))));
var hourHand = WHITE(T([1])([1.15])(MIRROR(1)(STRUCT([
	MKRECT([[-.25,0,-1],[-.25,.05,-1],[.25,0,-1],[.25,.05,-1]]),
	MIRROR(0)(MKRECT([[.25,0,-1],[.25,.05,-1],[.15,0,4],[.15,.05,4]])),
	MIRROR(0)(MAP(BEZIER(S1)([BEZIER(S0)([[0,0,3.9],[1.5,0,3.9],[.2,0,5.3],[0,0,5.3]]), BEZIER(S0)([[0,.05,3.9],[1.5,.05,3.9],[.2,.05,5.3],[0,.05,5.3]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))),
	MIRROR(0)(MAP(BEZIER(S1)([BEZIER(S0)([[0,0,4.1],[.6,0,4.1],[.6,0,4.8],[0,0,4.8]]), BEZIER(S0)([[0,.05,4.1],[.6,.05,4.1],[.6,.05,4.8],[0,.05,4.8]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))),
	T([1])([.05]),
	ROTATIONAL_SOLID([[.25,0,-1],[.15,0,4]])(2*PI)(2),
	MIRROR(0),
	MAP(BEZIER(S1)([BEZIER(S0)([[0,0,3.9],[1.5,0,3.9],[.2,0,5.3],[0,0,5.3]]), BEZIER(S0)([[0,0,4.1],[.6,0,4.1],[.6,0,4.8],[0,0,4.8]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))
]))));

/**
 * update the clock hand's rotation
 **/
var update_hands = function (coord){
	coord = typeof coord !== 'undefined' ? coord : [0,0,0];
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	hHand = T([0,1,2])(coord)(R([0,2])(-PI*(h%12)/6 + -PI*m/360)(hourHand));
	mHand = T([0,1,2])(coord)(R([0,2])(-PI*m/30)(minuteHand));
	DRAW(hHand); DRAW(mHand);
	console.log("Updating time: "+h+":"+m);
};

var hHand = hourHand;
var mHand = minuteHand;

var clock = STRUCT([petals, cyls, clockCenter, clockPin]);

//Scene:
var wall1 = CUBOID([120, 3, 75]);
var wall2 = CUBOID([3, 90, 75]);
var floor = CUBOID([120, 90, 3]);

var walls = STRUCT([wall1, wall2, floor]);

var scene = STRUCT([
	T([0,1,2])([25, 15, 3])(lamp),
	T([0,1,2])([60, 15, 3])(sofa),
	T([0,1,2])([40, 70, 3])(R([0,1])(-PI/2)(bench)),
	T([0,1,2])([70, 3 ,55])(clock),
// 	Let's paint it white!
	WHITE(walls)
]);

DRAW(scene);

var updateTime = setInterval(function(){CANCEL(hHand); CANCEL(mHand); update_hands([70, 3 ,55]);},60000);
update_hands([70, 3 ,55]);


