/*
Define, with names north, south, east, and west,
the 4 models of vertical enclosures (including the hollows),
and add them to the STRUCT of the building model.
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
// north:
// north0: part without hollows
north0 = GRID([[-17.5,.4], [.4,-8,1.4,-.45,.4], [-4,12.7]]);
// north0: part with big windows
north1 = GRID([[-17.5,.4], [-.4,8], [-4,2.15,-1.6,2.15,-1.6,2.15,-1.55,1.5]]);
// north2: part with little hollows
north2 = GRID([[-17.5,.4], [-9.75,.5], [-4,.5,-4,.5,-3.5,.5,-3.3,.4]]);
north = STRUCT([north0, north1, north2]);

// south:
south0 = GRID([[.4], [10.65], [-4,-.5,-3.2,.65,-3.2,1.8,-1.85,1.5]]);
south1 = GRID([[.4], [.55,-1.3,.4,-8,.4], [-4,.5,3.2,-.65,3.2,-1.8,-1.85,]]);
south2 = GRID([[.4], [.2,-1.9,.2], [-4,-.5,-3.2,-.65,-3.2,-1.8,1.85]]);
south3 = GRID([[.4], [-.55,-1.3,-.4,8], [-4,.5]]);
south = STRUCT([south0, south1, south2, south3, T([2,3])([.55,4+.5+3.2+.65])(CUBOID([.4, 1.3,3.2]))]);

// east:
east0 = GRID([[-8.75,.4,-4,4.75], [.4], [-4,12.7]]);
east1 = GRID([[8.75], [.4], [-4,9.35,-1.85,1.5]]);
east2 = GRID([[-8.75,-.4,4], [.4], [-4,2.1,-1.6,2.1,-1.6,2.1,-1.6,1.6]]);
east = STRUCT([east0, east1, east2]);

// west:
west0 = GRID([[17.9], [-10.25,.4], [-2.9,-.9,2.4,-1.6,2.1,-1.6,5.2]]);
west1 = GRID([[15.2], [-10.25,.4], [2.9]]);
west2 = GRID([[11.6, -.9,2.7], [-10.25,.4], [-2.9,.9]]);
west3 = GRID([[10,-4,3.9], [-10.25,.4], [-2.9,-.9,-2.4,1.6]]);
west4 = GRID([[14.2,-.2,.9,-.2,2.4], [-10.25,.4], [-2.9,-.9,-2.4,-1.6,-2.1,1.6]]);
west = STRUCT([west0, west1, west2, west3, west4]);

vertical_enclosures = STRUCT([north, south, east, west]);
//VIEW(vertical_enclosures);




/*******************************************************************************
*************************************EXERCISE 1 & 2*****************************
*******************************************************************************/

roundedPillar = T([1,2])([.2,.2])(CYLINDER ([.2,4])(12));
squaredPillar = CUBOID([.4,.4,4]);
smallPillar = CUBOID([.25,.25,4]);

pillars0South = NN(5)([roundedPillar, T([1])([4.375])]);
pillars0North = [T([2])([8.35]), roundedPillar].concat(NN(4)([T([1])([4.375]), squaredPillar]));
pillars0 = STRUCT(pillars0South.concat([T([1])([-4.375 * 5])]).concat(pillars0North));

pillars1South = NN(5)([squaredPillar, T([1])([4.375])]);
pillars1North = [T([2])([8.35])].concat(NN(3)([squaredPillar, T([1])([4.375])]).concat([roundedPillar, T([1])([4.375]), squaredPillar]));
pillars1 = STRUCT(pillars1South.concat([T([1])([-4.375 * 5])]).concat(pillars1North));

pillars2South = NN(2)([squaredPillar, T([1])([4.375])]).concat([T([1])([4.375*2]), squaredPillar]);
pillars2North = [T([2])([8.35])].concat(NN(5)([squaredPillar, T([1])([4.375])]));
pillars2 = STRUCT(pillars2South.concat([T([1])([-17.5])]).concat(pillars2North));

pillars3South = [T([1])([4.375 * 2]), squaredPillar, T([1])([4.375 * 2]), squaredPillar];
pillars3North = [T([2])([8.35]), T([1,2])([.075,.075])(smallPillar), T([1,2])([4.45,.075])(smallPillar), T([1])([4.375*2])].concat(NN(3)([squaredPillar,T([1])([4.375])]))
pillars3 = STRUCT(pillars3South.concat([T([1])([-17.5])]).concat(pillars3North));

pillars = STRUCT([pillars0, T([3])([4]), pillars1, T([3])([4]), pillars2, T([3])([4]), pillars3]);



floor00 = DOMAIN([[2.7,15.1],[6.5,9.85]])([1,1]);
floor01 = T([1,2])([15.1,9.85-1.675])((R([1,2])(-PI/2)(circular_sector(PI, 1.675))));
floor02 = DOMAIN([[2.7,13.125],[3.7,6.5]])([1,1]);
floor03 = DOMAIN([[2.7,3.8],[2.6,3.7]])([1,1]);
floor04 = T([1,2])([3.25,2.6])(R([1,2])(PI)(circular_sector(PI, .55)));
floor0 = EXTRUDE([.3])(STRUCT([floor00, floor01, floor02, floor03, floor04]));

floor10 = T([1,2,3])([-1.6,8.2,4])(GRID([[9.1,-2.2,8.2],[1.7],[.5]]));
floor11 = T([3])([4])(CUBOID([17.9,8.2,.5]));
floor1 = STRUCT([floor10,floor11]);

floor20 = T([2,3])([8.2,8])(GRID([[-7.5,1.3,4.375,4.7],[1.7],[.5]]));
floor21 = T([3])([8])(EXTRUDE([.5])(SIMPLICIAL_COMPLEX([[7.5,8.2],[8.8,8.2],[8.8,.4]])([[0,1,2]])));
floor22 = T([1,3])([8.8,8])(CUBOID([9.085,8.2,.5]));
floor2 = STRUCT([floor20, floor21, floor22]);

floor30 = T([2,3])([8.75,12])(GRID([[9.15,-4.85,3.5],[1.5],[.5]]));
floor31 = T([3])([12])(CUBOID([17.5, 8.75,.5]));
floor3 = STRUCT([floor30, floor31]);

floor4 = T([3])([16])(CUBOID([17.9,10,.75]));

ground = T([1,2])([-6,-4])(COLOR([0,1,0])(CUBOID([30,18,-.1])))
floors = T([2])([.4])(STRUCT([floor0, floor1, floor2, floor3, floor4, ground]))


/******************************************************************************/

building = STRUCT([pillars, floors, vertical_enclosures]);

VIEW(building);





