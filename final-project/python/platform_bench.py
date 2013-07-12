"""
 George Nelson Furniture:
 Platform Bench
"""

# Util functions:

ROTATIONAL_SURFACE = ROTATIONALSURFACE

def DOMAIN2D(domains1D = [INTERVALS(1)(32),INTERVALS(1)(32)]):
	dd = PROD([ domains1D[0], domains1D[1] ])
	complex = UKPOL(dd)
	points = complex[0]
	cells = CAT(AA(lambda x: [[x[0],x[1],x[3]],[x[3],x[1],x[2]]])(complex[1]))
	return MKPOL([ points, cells, None ])
PROD1x1 = DOMAIN2D

def MIRROR(axis):
	'''
	reflect an object along an axis
	'''
	return lambda obj: STRUCT([obj, S([axis])([-1])(obj)])

def ROTATIONAL_SOLID(points):
	'''
	Similar to ROTATIONAL_SURFACE but takes points, not curves.
	'''
	def ROTATIONAL_SOLID0(divs, angle):
		domain = DOMAIN2D([INTERVALS(len(points)-1)(len(points)-1), INTERVALS(angle)(divs)])
		def profile (x): 
			return points[int(x[0])]
		return MAP(ROTATIONAL_SURFACE(profile))(domain)
	return lambda angle: lambda divs: ROTATIONAL_SOLID0(divs, angle)

# ***Platform Bench*** 
# Measurements: H 14" D 18.5" W 48"

benchFoot = R([2,3])(-PI/2)(ROTATIONAL_SOLID([[0,0,-.15],[.6,0,-.15],[.6,0,0]])(2*PI)(24))
benchBase = STRUCT([T([1,3])([5,1])(benchFoot), EXTRUDE([None, MKPOL([[[0,12],[9.25,12],[0,11.25],[8.25,11.25],[0,0],[0,.75],[7,0],[6.25,.75]],[[1,2,4,3],[4,2,7,8],[8,7,5,6]],None]), 2])])
# mirror the base along the y-axis:
benchBase = R([2,3])(PI/2)(T([1,2,3])([9.25,.3,-9])(STRUCT(NN(2)([MIRROR(1)(benchBase), T([3])([-32])]))))

#11*.7+12*.9 = 18.5
rods = STRUCT(NN(12)([CUBOID([.9, 48,2]), T([1])([1.6])]))
# to prevent graphic glitches, perpendicular rods (prods) don't touch rods:
prods = STRUCT(NN(11)([T([1])([.9]), CUBOID([.7, 1, 2]), T([1])([.7])]))
prods = STRUCT(NN(2)([prods, T([2])([23])]))
prods = T([2])([24])(MIRROR(2)(prods))

bench = STRUCT([benchBase, T([3])([12.3]), prods, rods])

VIEW(bench)