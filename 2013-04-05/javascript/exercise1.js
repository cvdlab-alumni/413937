/*
 * Define, with names pillars0, pillars1, pillars2, and pillars3,
 * the models of pillars of the 4 house floors,
 * and put them into the STRUCT of an initial building model.
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



// The Maison Citrohan has two type of pillars: cylindrical and squared ones:
roundedPillar = T([1,2])([.2,.2])(CYLINDER ([.2,4])(12));
squaredPillar = CUBOID([.4,.4,4]);

// ...there are also small [squared] pillars...
smallPillar = CUBOID([.25,.25,4]);

// pillars0:
pillars0South = NN(5)([roundedPillar, T([1])([4.375])]);
// assuming the square shown in citrohan1.pdf as a piece of wall and not a pillar
//pillars0North = [T([2])([8.35]), roundedPillar, T([1])([2.3])(squaredPillar)].concat(NN(3)([T([1])([4.375]), squaredPillar]))
pillars0North = [T([2])([8.35]), roundedPillar].concat(NN(4)([T([1])([4.375]), squaredPillar]));
pillars0 = STRUCT(pillars0South.concat([T([1])([-4.375 * 5])]).concat(pillars0North));

// pillars1:
pillars1South = NN(5)([squaredPillar, T([1])([4.375])]);
pillars1North = [T([2])([8.35])].concat(NN(3)([squaredPillar, T([1])([4.375])]).concat([roundedPillar, T([1])([4.375]), squaredPillar]));
pillars1 = STRUCT(pillars1South.concat([T([1])([-4.375 * 5])]).concat(pillars1North));

// pillars2:
pillars2South = NN(2)([squaredPillar, T([1])([4.375])]).concat([T([1])([4.375*2]), squaredPillar]);
pillars2North = [T([2])([8.35])].concat(NN(5)([squaredPillar, T([1])([4.375])]));
pillars2 = STRUCT(pillars2South.concat([T([1])([-17.5])]).concat(pillars2North));

// pillars3:
pillars3South = [T([1])([4.375 * 2]), squaredPillar, T([1])([4.375 * 2]), squaredPillar];
pillars3North = [T([2])([8.35]), T([1,2])([.075,.075])(smallPillar), T([1,2])([4.45,.075])(smallPillar), T([1])([4.375*2])].concat(NN(3)([squaredPillar,T([1])([4.375])]))
pillars3 = STRUCT(pillars3South.concat([T([1])([-17.5])]).concat(pillars3North));

pillars = STRUCT([pillars0, T([3])([4]), pillars1, T([3])([4]), pillars2, T([3])([4]), pillars3]);
building = STRUCT([pillars]);

VIEW(building);
