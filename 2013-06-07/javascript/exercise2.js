/**
 * A lake can be obtained by adding a colored parallelepiped (green-water) to a
 * digital terrain model, in such a way that the height of the parallelepiped 
 * gets higher than the altitude of the bottom-valley pattern.
 * 
 * A suitable lake model should be added to the mountains defined by the previous exercise.
 **/

/************************************ ex.1 ************************************/
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
var scene = STRUCT([terrain]);
/******************************************************************************/

// Lake color:
var waterColor = [0, 191/255, 255/255];

// Lakes are a big, simple cuboid...
var lakes = T([2])([-8])(COLOR(waterColor)(CUBOID([worldDims[0], worldDims[1], 6])));
DRAW(lakes);
