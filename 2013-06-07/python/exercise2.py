'''
A lake can be obtained by adding a colored parallelepiped (green-water) to a
digital terrain model, in such a way that the height of the parallelepiped 
gets higher than the altitude of the bottom-valley pattern.

A suitable lake model should be added to the mountains defined by the previous exercise.
'''

##################################### ex.1 #####################################
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
seed1 = 3 + 3*random.random()
seed2 = .2 + .2*random.random()
seed3 = 5 + 2*random.random()
def x(u,v):
	return u
def y(u,v):
	return v
def z(u,v):
	return SIN(COS(u/seed1)*PI) + seed2 + COS(SIN(v/seed3)*PI) + seed2 * COS(v + u/(seed3*3/2)) - seed3*SIN(PI*u/25)*SIN(PI*v/25)
def mappingFunction(point):
	return [x(point[0], point[1]), y(point[0], point[1]), z(point[0], point[1])]
terrain = COLOR([139./255, 69./255, 19./255])(MAP(mappingFunction)(worldDomain))
scene = STRUCT([terrain])
################################################################################

# Lake color:
waterColor = [0, 191/255, 255/255]

# Lakes are a big, simple cuboid...
lakes = T([3])([-8])(COLOR(waterColor)(CUBOID([worldDims[0], worldDims[1], 6])))
VIEW(lakes)
