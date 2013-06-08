'''
A digital terrain model (DTM) is normally defined as a map that associates
the vertices of a simplicial decomposition of a 2D rectangle (corresponding
to a geographical map) with three coordinate functions x(u,v), y(u,v),
z(u,v), where x(u,v) and y(u,v) are the selectors of the first and second
coordinate of the vertices, and z(u,v) provides the height (altitude) of
vertices. This one can be obtained by adding or subtracting a (relatively
small) random number to the altitude values. HINT: To provide the initial
values of altitude it is recommended to use either some mathematical 
function of two variables, or a surface generated from a few control points.
The random correction of altitude must obviously be executed in a second
computing stage.

Produce a model of mountainous terrain using the approach described above.
'''

# change parameters to change world dimensions and divisions:
worldDims = [50,50]	# at least 50*50
worldDivs = [64,64]

def DOMAIN2D(domains1D = [INTERVALS(1)(32),INTERVALS(1)(32)]):
	dd = PROD([ domains1D[0], domains1D[1] ])
	complex = UKPOL(dd)
	points = complex[0]
	cells = CAT(AA(lambda x: [[x[3],x[1],x[0]],[x[2],x[1],x[3]]])(complex[1]))
	return MKPOL([ points, cells, None ])

worldDomain = DOMAIN2D([INTERVALS(worldDims[0])(worldDivs[0]),INTERVALS(worldDims[1])(worldDivs[1])])

import random
# seed that will randomly plasm the terrain:
seed1 = 3 + 3*random.random()
seed2 = .2 + .2*random.random()
seed3 = 5 + 2*random.random()

# coordinate functions:
def x(u,v):
	return u
def y(u,v):
	return v
def z(u,v):
	return SIN(COS(u/seed1)*PI) + seed2 + COS(SIN(v/seed3)*PI) + seed2 * COS(v + u/(seed3*3/2)) - seed3*SIN(PI*u/25)*SIN(PI*v/25)

def mappingFunction(point):
	return [x(point[0], point[1]), y(point[0], point[1]), z(point[0], point[1])]
terrain = COLOR([139./255, 69./255, 19./255])(MAP(mappingFunction)(worldDomain))
VIEW(terrain)