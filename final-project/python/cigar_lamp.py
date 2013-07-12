"""
 George Nelson Furniture:
 Cigar Lamp
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

def DUPLIROT(axis):
	'''
	Rotate end create n copies of an hpc object.
	Usage: DUPLIROT([axis, axis])(angle)(object)(number)
	'''
	return lambda alpha: lambda obj : lambda n : STRUCT([R(axis)(alpha*i)(obj) for i in range(n)])

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

# ***Cigar Lamp*** 
# Measurements: H 63.5" Diameter 10"
lampBase = ROTATIONAL_SOLID([[0,0,.3],[3,0,.3],[3,0,0],[4.5,0,0],[4.5,0,.3],[6,0,.3],[6,0,.6],[.3,0,.6],[.3,0,45.9],[2.5,0,45.9],[2.5,0,46],[.3,0,46],[.3,0,63.4],[2.5,0,63.4],[2.5,0,63.5],[0,0,63.5]])(2*PI)(64)
shadeCP = [[2,0,46],[3,0,46],[3,0,46],[6,0,50.2],[6,0,59.2],[3,0,63.4],[3,0,63.4],[2,0,63.4]]
shade = STRUCT([
	MAP(ROTATIONAL_SURFACE(BSPLINE(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP)))(PROD1x1([INTERVALS(5)(64), INTERVALS(2*PI)(32)])),
	DUPLIROT([1,2])(PI/16)(NUBSPLINE(3)([0,0,0,0,1,2,3,4,5,5,5,5])(shadeCP))(32)
])
lamp = STRUCT([lampBase, shade])

VIEW(lamp)