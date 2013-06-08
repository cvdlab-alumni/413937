/**
 * A digital terrain model (DTM) is normally defined as a map that associates
 * the vertices of a simplicial decomposition of a 2D rectangle (corresponding
 * to a geographical map) with three coordinate functions x(u,v), y(u,v),
 * z(u,v), where x(u,v) and y(u,v) are the selectors of the first and second
 * coordinate of the vertices, and z(u,v) provides the height (altitude) of
 * vertices. This one can be obtained by adding or subtracting a (relatively
 * small) random number to the altitude values. HINT: To provide the initial
 * values of altitude it is recommended to use either some mathematical 
 * function of two variables, or a surface generated from a few control points.
 * The random correction of altitude must obviously be executed in a second
 * computing stage.
 * 
 * Produce a model of mountainous terrain using the approach described above.
 **/

// change parameters to change world dimensions and divisions:
var worldDims = [50,50];	// at least 50*50
var worldDivs = [64,64];
var worldDomain = PROD1x1([INTERVALS(worldDims[0])(worldDivs[0]),INTERVALS(worldDims[1])(worldDivs[1])]);

// seed that will randomly plasm the terrain:
var seed1 = 3 + 3*Math.random();
var seed2 = .2 + .2*Math.random();
var seed3 = 5 + 2*Math.random();

// coordinate functions:
var x = function(u,v){
	return u;
};
var y = function(u,v){
	return v;
};
var z = function(u,v){
	return SIN(COS(u/seed1)*PI) + seed2 + COS(SIN(v/seed3)*PI) + seed2 * COS(v + u/(seed3*3/2)) - seed3*SIN(PI*u/25)*SIN(PI*v/25);
};

var mappingFunction = function(point){
	return [x(point[0], point[1]), y(point[0], point[1]), z(point[0], point[1])];
};

var terrain = COLOR([139./255, 69./255, 19./255])(MAP(mappingFunction)(worldDomain));
DRAW(terrain);







































var coordFunc = function(point){
	// initial values of altitude
	var altitude = SIN(COS(point[0]/3)*PI) + .3 + COS(SIN(point[1]/6)*PI) + .3 * COS(point[1] + point[0]/2) + 6*SIN(PI*point[0]/25)*SIN(PI*point[1]/25);
	// adding a small random number
	altitude += (.1 * (Math.random()-.5));
	return [point[0], point[1], altitude];
};



