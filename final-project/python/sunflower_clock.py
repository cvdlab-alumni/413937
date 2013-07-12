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

def AAPOINTS(func):
	"""
	Apply a function to all points
	usage:
	AAPOINTS(func)(parameters)(points)
	e.g.: AAPOINTS(SUM)([1,.3,10])([[0,0,0],[1,0,3],[2,0,9]])
	"""
	return lambda operands : lambda args : map(lambda list : [func([operands[i],list[i]]) for i in range(len(list))], args)

def MIRROR(axis):
	'''
	reflect an object along an axis
	'''
	return lambda obj: STRUCT([obj, S([axis])([-1])(obj)])

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

# ***Sunflower Clock***
# Measurements: Diameter 29.5" D 3"

# There are 24 petals...
petalCP1 = [[14.75,0] ,[13,0],[COS(PI/24)*12.6,SIN(PI/24)*12.6-.1],[COS(PI/24)*10.75, SIN(PI/24)*10.75-.1]]
petalCP2 = [[COS(PI/24)*10.75, SIN(PI/24)*10.75-.1],[COS(PI/24)*9.5, SIN(PI/24)*9.5-.1],[8.5,0],[7.75, 0]]
petalCP3 = [[7.75, 0],[6.5,0],[COS(PI/24)*6, SIN(PI/24)*6-.1],[COS(PI/24)*5.25, SIN(PI/24)*5.25-.1]]
petalCP4 = [[COS(PI/24)*5.25, SIN(PI/24)*5.25-.1],[COS(PI/24)*4.25, SIN(PI/24)*4.25-.1],[3.5,0],[2, 0]]

petalCPs = [petalCP1, petalCP2, petalCP3, petalCP4]

petals = R([2,3])(-PI/2)(DUPLIROT([1,2])(PI/12)(MIRROR(2)(EXTRUDE([None, STRUCT(AA(lambda points: MAP(BEZIER(S2)([BEZIER(S1)(points), BEZIER(S1)(AAPOINTS(SUM)([0,.1])(points))]))(PROD1x1([INTERVALS(1)(24), INTERVALS(1)(1)])))(petalCPs)),1])))(24))

cyls = R([2,3])(-PI/2)(DUPLIROT([1,2])(PI/6)(T([1,3])([7.75,.5])(CYLINDER([.15,.8])(32)))(12))

clockCenter = R([2,3])(-PI/2)(STRUCT([
	ROTATIONAL_SOLID([[0,0,.1],[2.5,0,0],[2.5,0,.7]])(2*PI)(64),
	MAP(ROTATIONAL_SURFACE(BEZIER(S1)([[2.5,0,.7],[2.5,0,.8],[2.4,0,.8]])))(PROD1x1([INTERVALS(1)(6), INTERVALS(2*PI)(64)])),
	ROTATIONAL_SOLID([[2.4,0,.8],[1.8,0,.8],[1.8,0,1]])(2*PI)(64),
	MAP(ROTATIONAL_SURFACE(BEZIER(S1)([[1.8,0,1],[1.8,0,1.1],[1.7,0,1.1]])))(PROD1x1([INTERVALS(1)(6), INTERVALS(2*PI)(64)])),
	ROTATIONAL_SOLID([[1.7,0,1.1],[0,0,1.1]])(2*PI)(64)
]))


clockPin = R([2,3])(-PI/2)(ROTATIONAL_SOLID([[.1,0,1],[.1,0,1.3],[.2,0,1.3],[.1,0,1.4],[0,0,1.4]])(2*PI)(32))

# EXTRUDE doesn't work...
minuteHand = T([2])([1.25])(MIRROR(2)(STRUCT([
	MKPOL([[[-.1,0,7.5],[-.1,.05,7.5],[.1,0,7.5],[.1,.05,7.5]],[[1,2,3,4]], None]),
	MIRROR(1)(MKPOL([[[.1,0,7.5],[.1,.05,7.5],[.2,0,5],[.2,.05,5]], [[1,3,2,4]], None])),
	MIRROR(1)(MKPOL([[[.2,0,5],[.2,.05,5],[.2,0,-1.2],[.2,.05,-1.2]], [[1,2,3,4]], None])),
	MIRROR(1)(MAP(BEZIER(S2)([BEZIER(S1)([[.2,.05,-1.2],[1,.05,-1.2],[1,.05,-2.4],[0,.05,-2.4]]), BEZIER(S1)([[.2,0,-1.2],[1,0,-1.2],[1,0,-2.4],[0,0,-2.4]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))),
	T([2])([.05]),
	MKPOL([[[.1,0,7.5],[.2,0,5],[.2,0,-1.2],[-.1,0,7.5],[-.2,0,5],[-.2,0,-1.2]], [[1,2,3,6,5,4]], None]),
	MAP(BEZIER(S2)([(BEZIER(S1)([[-.2,0,-1.2],[-1,0,-1.2],[-1,0,-2.4],[0,0,-2.4]])), BEZIER(S1)([[0.2, 0, -1.2], [1, 0, -1.2], [1, 0, -2.4], [0, 0, -2.4]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(2)]))
])))
hourHand = T([2])([1.15])(MIRROR(2)(STRUCT([
	MKPOL([[[-.25,0,-1],[-.25,.05,-1],[.25,0,-1],[.25,.05,-1]],[[1,2,4,3]], None]),
	MIRROR(1)(MKPOL([[[.25,0,-1],[.25,.05,-1],[.15,0,4],[.15,.05,4]],[[1,3,2,4]], None])),
	MIRROR(1)(MAP(BEZIER(S2)([BEZIER(S1)([[0,0,3.9],[1.5,0,3.9],[.2,0,5.3],[0,0,5.3]]), BEZIER(S1)([[0,.05,3.9],[1.5,.05,3.9],[.2,.05,5.3],[0,.05,5.3]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))),
	MIRROR(1)(MAP(BEZIER(S2)([BEZIER(S1)([[0,.05,4.1],[.6,.05,4.1],[.6,.05,4.8],[0,.05,4.8]]), BEZIER(S1)([[0,0,4.1],[.6,0,4.1],[.6,0,4.8],[0,0,4.8]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))),
	T([2])([.05]),
	MKPOL([[[.25,0,-1],[.15,0,4],[-.25,0,-1],[-.15,0,4]], [[1,2,3,4]], None]),
	MIRROR(1),
	MAP(BEZIER(S2)([BEZIER(S1)([[0,0,3.9],[1.5,0,3.9],[.2,0,5.3],[0,0,5.3]]), BEZIER(S1)([[0,0,4.1],[.6,0,4.1],[.6,0,4.8],[0,0,4.8]])]))(PROD1x1([INTERVALS(1)(32), INTERVALS(1)(1)]))
])))

clock = STRUCT([petals, cyls, clockCenter, clockPin, minuteHand, hourHand])

VIEW(clock)
