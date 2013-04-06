/*
Define with names stair1, stair2, and stair3
(from bottom up to top), and insert within the building model,
the 3 stair models of the building.
*/

/******************************************************************************/
// adapt pyplasm code to plasm.js code
/******************************************************************************/

T = function (dims) {
  dims = dims.map(function (dim) {
    return dim - 1;
  });

  return function (values) {
    return function (object) {
     return object.clone().translate(dims, values);
    };
  };
};
  
R = function (dims) {
  dims = dims.map(function (dim) {
    return dim - 1;
  });
   
  return function (angle) {
    return function (object) {
      return object.clone().rotate(dims, angle);
    };
  };
};
  
S = function (dims) {
  dims = dims.map(function (dim) {
    return dim - 1;
  });

  return function (values) {
    return function (object) {
      return object.clone().scale(dims, values);
    };
  };
};

function circle (r) {
	return function (divs) {
		var domain = DOMAIN([[0,2*PI],[0,r]])([divs,1]);
		var mapping = function (v) {
			var a = v[0];
			var r = v[1];
			return [r*COS(a), r*SIN(a)];
		}
		var model = MAP(mapping)(domain);
		return model;
	};
};

CYLINDER = function (dims) {
	return function cyl0(divs) {
		return STRUCT([circle(dims[0])([divs]), CYL_SURFACE(dims)([divs]), T([3])([dims[1]])(circle(dims[0])([divs]))])
	}
};

S3 = S2;
S2 = S1;
S1 = S0;

GRID = SIMPLEX_GRID;

NN = REPLICA;

VIEW = DRAW;

/******************************************************************************/

// utils functions:


GRID = SIMPLEX_GRID;

function annulus_sector (alpha, r, R) {
	var domain = DOMAIN([[0,alpha],[r,R]])([36,1]);
	var mapping = function (v) {
		var a = v[0];
		var r = v[1];
		return [r*COS(a), r*SIN(a)];
	};
	var model = MAP(mapping)(domain);
	return model;
};

function circular_sector(alpha, r) {
	return annulus_sector(alpha, 0, r);
};
/******************************************************************************/


var n=12
var depth = 5.5/n
var raiser = 4./n * 3
var step2D = SIMPLICIAL_COMPLEX([[0,0],[0,raiser],[depth,raiser],[depth,raiser/3.]])([[0,2,1],[0,2,3]])
var ramp2D = STRUCT(NN(n)([step2D,T([1,2])([depth, raiser/3.])]))
var ramp3D = R([2,3])(PI/2)(EXTRUDE([1.5])(ramp2D))

var stair1 = T([1,2,3])([5,10.3,-.6])(ramp3D)
var stair2 = T([1,2,3])([2,10.3,3.82])(ramp3D)
var stair3 = T([1,2,3])([8.5,10.3,7.82])(ramp3D)


var stairs = STRUCT([stair1, stair2, stair3])



/*******************************************************************************
************************************EXERCISE 1,2,3,4****************************
*******************************************************************************/

var roundedPillar = T([1,2])([.2,.2])(CYLINDER ([.2,4])(12));
var squaredPillar = CUBOID([.4,.4,4]);
var smallPillar = CUBOID([.25,.25,4]);

var pillars0South = NN(5)([roundedPillar, T([1])([4.375])]);
var pillars0North = [T([2])([8.35]), roundedPillar].concat(NN(4)([T([1])([4.375]), squaredPillar]));
var pillars0 = STRUCT(pillars0South.concat([T([1])([-4.375 * 5])]).concat(pillars0North));

var pillars1South = NN(5)([squaredPillar, T([1])([4.375])]);
var pillars1North = [T([2])([8.35])].concat(NN(3)([squaredPillar, T([1])([4.375])]).concat([roundedPillar, T([1])([4.375]), squaredPillar]));
var pillars1 = STRUCT(pillars1South.concat([T([1])([-4.375 * 5])]).concat(pillars1North));

var pillars2South = NN(2)([squaredPillar, T([1])([4.375])]).concat([T([1])([4.375*2]), squaredPillar]);
var pillars2North = [T([2])([8.35])].concat(NN(5)([squaredPillar, T([1])([4.375])]));
var pillars2 = STRUCT(pillars2South.concat([T([1])([-17.5])]).concat(pillars2North));

var pillars3South = [T([1])([4.375 * 2]), squaredPillar, T([1])([4.375 * 2]), squaredPillar];
var pillars3North = [T([2])([8.35]), T([1,2])([.075,.075])(smallPillar), T([1,2])([4.45,.075])(smallPillar), T([1])([4.375*2])].concat(NN(3)([squaredPillar,T([1])([4.375])]))
var pillars3 = STRUCT(pillars3South.concat([T([1])([-17.5])]).concat(pillars3North));

var pillars = STRUCT([pillars0, T([3])([4]), pillars1, T([3])([4]), pillars2, T([3])([4]), pillars3]);

var floor00 = DOMAIN([[2.7,15.1],[6.5,9.85]])([1,1]);
var floor01 = T([1,2])([15.1,9.85-1.675])((R([1,2])(-PI/2)(circular_sector(PI, 1.675))));
var floor02 = DOMAIN([[2.7,13.125],[3.7,6.5]])([1,1]);
var floor03 = DOMAIN([[2.7,3.8],[2.6,3.7]])([1,1]);
var floor04 = T([1,2])([3.25,2.6])(R([1,2])(PI)(circular_sector(PI, .55)));
var floor0 = EXTRUDE([.3])(STRUCT([floor00, floor01, floor02, floor03, floor04]));

var floor10 = T([1,2,3])([-1.6,8.2,4])(GRID([[9.1,-2.2,8.2],[1.7],[.5]]));
var floor11 = T([3])([4])(CUBOID([17.9,8.2,.5]));
var floor1 = STRUCT([floor10,floor11]);

var floor20 = T([2,3])([8.2,8])(GRID([[-7.5,1.3,4.375,4.7],[1.7],[.5]]));
var floor21 = T([3])([8])(EXTRUDE([.5])(SIMPLICIAL_COMPLEX([[7.5,8.2],[8.8,8.2],[8.8,.4]])([[0,1,2]])));
var floor22 = T([1,3])([8.8,8])(CUBOID([9.085,8.2,.5]));
var floor2 = STRUCT([floor20, floor21, floor22]);

var floor30 = T([2,3])([8.75,12])(GRID([[9.15,-4.85,3.5],[1.5],[.5]]));
var floor31 = T([3])([12])(CUBOID([17.5, 8.75,.5]));
var floor3 = STRUCT([floor30, floor31]);

var floor4 = T([3])([16])(CUBOID([17.9,10,.75]));
var floors = STRUCT([floor0, floor1, floor2, floor3, floor4]);

var north0 = GRID([[-17.5,.4], [.4,-8,1.4,-.45,.4], [-4,12.7]]);
var north1 = GRID([[-17.5,.4], [-.4,8], [-4,2.15,-1.6,2.15,-1.6,2.15,-1.55,1.5]]);
var north2 = GRID([[-17.5,.4], [-9.75,.5], [-4,.5,-4,.5,-3.5,.5,-3.3,.4]]);
var north = STRUCT([north0, north1, north2]);

var south0 = GRID([[.4], [10.65], [-4,-.5,-3.2,.65,-3.2,1.8,-1.85,1.5]]);
var south1 = GRID([[.4], [.55,-1.3,.4,-8,.4], [-4,.5,3.2,-.65,3.2,-1.8,-1.85,]]);
var south2 = GRID([[.4], [.2,-1.9,.2], [-4,-.5,-3.2,-.65,-3.2,-1.8,1.85]]);
var south3 = GRID([[.4], [-.55,-1.3,-.4,8], [-4,.5]]);
var south = STRUCT([south0, south1, south2, south3, T([2,3])([.55,4+.5+3.2+.65])(CUBOID([.4, 1.3,3.2]))]);

var east0 = GRID([[-8.75,.4,-4,4.75], [.4], [-4,12.7]]);
var east1 = GRID([[8.75], [.4], [-4,9.35,-1.85,1.5]]);
var east2 = GRID([[-8.75,-.4,4], [.4], [-4,2.1,-1.6,2.1,-1.6,2.1,-1.6,1.6]]);
var east = STRUCT([east0, east1, east2]);

var west0 = GRID([[17.9], [-10.25,.4], [-2.9,-.9,2.4,-1.6,2.1,-1.6,5.2]]);
var west1 = GRID([[15.2], [-10.25,.4], [2.9]]);
var west2 = GRID([[11.6, -.9,2.7], [-10.25,.4], [-2.9,.9]]);
var west3 = GRID([[10,-4,3.9], [-10.25,.4], [-2.9,-.9,-2.4,1.6]]);
var west4 = GRID([[14.2,-.2,.9,-.2,2.4], [-10.25,.4], [-2.9,-.9,-2.4,-1.6,-2.1,1.6]]);
var west = STRUCT([west0, west1, west2, west3, west4]);

var vertical_enclosures = STRUCT([north, south, east, west]);

var big_window_horiz_bar = COLOR([0,0,0])(R([2,3])(-PI/2)(STRUCT(NN(3)([CYLINDER([.1,8])(12), T([2])([-1.6])]))));
var big_window_vert_bar = COLOR([0,0,0])(STRUCT(NN(5)([CYLINDER([.1,3.2])(12), T([2])([2])])));

var big_window_bars = STRUCT([big_window_horiz_bar, big_window_vert_bar]);
var big_window_glass = COLOR([.1,1,1,.9])(T([1])([.05])(CUBOID([.01,8,3.2])));

var big_window = STRUCT([big_window_bars, big_window_glass]);

var balcony_bars = COLOR([0,0,0])(R([3,2])(PI/2)((R([1,3])(-PI/2)(STRUCT(NN(3)([T([2])([-.3]) ,CYLINDER([.05,1.6])(12)]))))));
var balcony_wall = (CUBOID([.2,1.7,1.1]));

var balcony = STRUCT([T([1,2,3])([1.6,.2,1.2])(balcony_bars), T([1])([-.1])(balcony_wall), T([1,2,3])([1.6,1.5,1.2])(balcony_bars)]);

var windows = STRUCT([T([1,2,3])([-1.5,8.6,4.5])(balcony), T([1,2,3])([-.1,.5,4.5])(big_window), T([1,2,3])([-.1,.5,8.4])(big_window)]);


/******************************************************************************/



var building = STRUCT([pillars, floors, vertical_enclosures, windows, stairs]);

VIEW(building);
