/**
 * Build near the edge of the mountainous area a model (in appropriate scale)
 * of a human settlement, randomly assembling several parallel rectangular 
 * buildings (of varying heights and sizes). The settlement must be produced 
 * in local coordinates in function of some parameters, and then placed on the
 * scene in at least two different instances, as produced by different generator
 * parameters.
 * 
 * The student is free to select any number and meaning of the generator parameters.
 **/

/********************************** ex.1,2,3 **********************************/
// change parameters to change world dimensions and divisions:
var worldDims = [50,50];
var worldDivs = [64,64];
var seed1 = 3 + 3*Math.random();
var seed2 = .2 + .2*Math.random();
var seed3 = 5 + 2*Math.random();
var worldDomain = PROD1x1([INTERVALS(worldDims[0])(worldDivs[0]),INTERVALS(worldDims[1])(worldDivs[1])]);
var x = function(u,v){ return u; };
var y = function(u,v){ return v; };
var z = function(u,v){
	return SIN(COS(u/seed1)*PI) + seed2 + COS(SIN(v/seed3)*PI) + seed2 * COS(v + u/(seed3*3/2)) - seed3*SIN(PI*u/25)*SIN(PI*v/25);
};
var mappingFunction = function(point){
	return [x(point[0], point[1]), y(point[0], point[1]), z(point[0], point[1]) + (.1 * (Math.random()-.5))];
};
var terrain = COLOR([139./255, 69./255, 19./255])(MAP(mappingFunction)(worldDomain));
var waterColor = [0, 191/255, 255/255];
var lakes = T([2])([-8])(COLOR(waterColor)(CUBOID([worldDims[0], worldDims[1], 6])));
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
var tree = function(height, radius, divs){
	return STRUCT([
		COLOR([0,.75,0])(ROTATIONAL_SOLID([[0,0,height],[radius,0,height/7],[0,0,height/7]])(2*PI)(divs)),
		COLOR([139/255, 69/255, 18/255])(ROTATIONAL_SOLID([[0,0,-.5],[radius/3,0,-.5],[radius/3,0,height/7]])(2*PI)(divs))
	]);
};
var randomTree = function(){
	return tree(.5 + .5*Math.random(), .1 + .3*Math.random(), 4 + Math.floor(9*Math.random()));
};
var trees = [];
var placeTrees = function(altitude, density){
	var grid = PROD1x1([INTERVALS(worldDims[0])(Math.floor(worldDivs[0]*density)),INTERVALS(worldDims[1])(Math.floor(worldDivs[1]*density))]);
	var mappingTrees = function(point){
		var fuzzyX = point[0] + Math.random()-.5;
		var fuzzyY = point[1] + Math.random()-.5;
		if (z(fuzzyX, fuzzyY) > altitude)
			trees.push(T([0,1,2])([fuzzyX, fuzzyY, z(fuzzyX, fuzzyY)])(randomTree()));
		// dummy return:
		return [0,0,0];
	};
	MAP(mappingTrees)(grid);
};
placeTrees(1.3, 1);
trees = STRUCT(trees);
var scene = STRUCT([terrain, lakes, trees]);
/******************************************************************************/


/*
 * Function to create random sized and colored buildings:
 */
var randomBuilding = function(){
	return COLOR([.5*Math.random()])(T([2])([-.5])(CUBOID([(.3+Math.random()*.6)*worldDims[0]/worldDivs[0], (.3+Math.random()*.6)*worldDims[1]/worldDivs[1], (.8+Math.random()*.5)])));
};

/*
 * density is an integer that set the number of buildings between streets.
 */
var buildings = [];
var placeBuildings = function(minAltitude, maxAltitude, density){
	var grid = PROD1x1([INTERVALS(worldDims[0])(Math.floor(worldDivs[0])),INTERVALS(worldDims[1])(Math.floor(worldDivs[1]))]);
	var bounds = [worldDims[0]/3, 2*worldDims[0]/3];
	var mappingBuildings = function(point){
		if ((point[0] < bounds[0] || point[0] > bounds[1]) && point[1] > bounds[0] && point[1] < bounds[1] && point[0]*(worldDivs[0]/worldDims[0])%density!==0 && point[1]*(worldDivs[1]/worldDims[1])%density!==0 && z(point[0], point[1]) > minAltitude && z(point[0], point[1]) < maxAltitude)
			buildings.push(T([0,1,2])([point[0], point[1], z(point[0], point[1])])(randomBuilding()));
		// dummy return:
		return [0,0,0];
	};
	MAP(mappingBuildings)(grid);
};
placeBuildings(-1,1,3);
buildings = STRUCT(buildings);





