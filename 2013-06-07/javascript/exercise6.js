/**
 * Write a function to export a LAR model, which is a pair (V, FV), where V is
 * an array of points and FV is the compact representation of the characteristic
 * matrix of 2D faces, in the file format OBJ.
 */


/******************************** ex.1,2,3,4,5 ********************************/
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
var randomBuilding = function(){
	return COLOR([.5*Math.random()])(T([2])([-.5])(CUBOID([(.3+Math.random()*.6)*worldDims[0]/worldDivs[0], (.3+Math.random()*.6)*worldDims[1]/worldDivs[1], (.8+Math.random()*.5)])));
};
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
var scene = STRUCT([terrain, lakes, trees, buildings]);
var road = function(p1, p2){
	var c = p1[0]===p2[0]?0:1;
	var size = .3 + p1[c] - Math.floor(p1[c]);
	var cp1 = [[p1[0]+(c===0?size/2:0),p1[1]+(c!==0?size/2:0)],[p1[0]-(c===0?size/2:0),p1[1]-(c!==0?size/2:0)]];
	var cp2 = [[p2[0]+(c===0?size/2:0),p2[1]+(c!==0?size/2:0)],[p2[0]-(c===0?size/2:0),p2[1]-(c!==0?size/2:0)]];
	cp1[0].push(z(cp1[0][0],cp1[0][1]));
	cp1[1].push(z(cp1[1][0],cp1[1][1]));
	cp2[0].push(z(cp2[0][0],cp2[0][1]));
	cp2[1].push(z(cp2[1][0],cp2[1][1]));
	return T([2])([.1])(MAP(BEZIER(S1)([BEZIER(S0)(cp1), BEZIER(S0)(cp2)]))(PROD1x1([INTERVALS(1)(1), INTERVALS(1)(1)])));
};
var x = road([0,0],[0,10]);
var roads = [];
var placeRoads = function(minAltitude, maxAltitude, density){
	var grid = PROD1x1([INTERVALS(worldDims[0])(Math.floor(worldDivs[0])),INTERVALS(worldDims[1])(Math.floor(worldDivs[1]))]);
	var bounds = [worldDims[0]/3, 2*worldDims[0]/3];
	var mappingRoads = function(point){
		if ((point[0] < bounds[0] || point[0] > bounds[1]) && point[1] > bounds[0] && point[1] < bounds[1] && z(point[0], point[1]) > minAltitude && z(point[0], point[1]) < maxAltitude){
			if (point[0]*(worldDivs[0]/worldDims[0])%density===0){
				var next = [point[0],point[1] + (worldDims[1]/worldDivs[1])];
				roads.push(road(point, next));
			}
			if (point[1]*(worldDivs[1]/worldDims[1])%density===0){
				var next = [point[0]+(worldDims[0]/worldDivs[0]), point[1]];
				roads.push(road(point, next));
			}
		}
		return [0,0,0];
	};
	MAP(mappingRoads)(grid);
};
placeRoads(-1.2,1.2,3);
roads = COLOR([.1,.1,.1])(STRUCT(roads));
var scene = STRUCT([terrain, lakes, trees, buildings, roads]);
/******************************************************************************/

/**
 * It doesn't save colors...
 * ... it's a bit buggy, works well only for faces made by 3 or 4 vertex.
 **/
/**
 * input:	a LAR model
 * 		(an array [v, fv] where v is a vertex array and fv the matrix of the faces)
 * output:	a string representing an OBJ model
 **/
var lar_to_obj = function(model){
	var res = "# OBJ exported from a LAR model\n\n#Vertices:";
	var V = model[0];
	var FV = model[1];
	for (var i = 0; i < V.length; i++)
		res += "\nv " + V[i][0] + " " + V[i][1] +" "+ (typeof V[i][2] === 'undefined'?"0":V[i][2]);
	res += "\n\n#Faces:";
	for (var i = 0; i < FV.length; i++){
		// triangles from face:
		for (var j = 0; j <FV[i].length-2; j++)
			res += "\nf " + (FV[i][j]+1) + " " + (FV[i][j+1]+1) + " " + (FV[i][j+2]+1);
		
	}
	return res;
	
};




