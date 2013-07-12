"""
 George Nelson Furniture:
 Cigar Lamp
"""

#Util functions:

ROTATIONAL_SURFACE = ROTATIONALSURFACE

def DOMAIN2D(domains1D = [INTERVALS(1)(32),INTERVALS(1)(32)]):
	dd = PROD([ domains1D[0], domains1D[1] ])
	complex = UKPOL(dd)
	points = complex[0]
	cells = CAT(AA(lambda x: [[x[0],x[1],x[3]],[x[3],x[1],x[2]]])(complex[1]))
	return MKPOL([ points, cells, None ])
PROD1x1 = DOMAIN2D

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

def TORUS (R, r):
	def TORUS0(v):
		a = v[0]
		b = v[1]
		u = (r * COS(a) + R) * COS(b)
		v = (r * COS(a) + R) * SIN(b)
		w = r * SIN(a)
		return [u, v, w]
	return TORUS0

BLACK = COLOR([0,0,0])

# ***Marshmallow Sofa***
# Measurements: H 31" D 29" W 52" Seat H 16"

#Pillow:
pillowCP = [[0,0,0],[0,0,0],[4.8,0,0],[5,0,.2],[5,0,1.9],[4.8,0,2],[5,0,2],[5,0,2.2],[4.8,0,2.2],[4.9,0,2],[4.5,0,2.7],[0,0,2.7],[0,0,2.7]]
pillow1 = MAP(ROTATIONAL_SURFACE(BSPLINE(3)([0,0,0,0,2,3,4,5,6,7,8,9,10,12,12,12,12])(pillowCP)))(PROD1x1([INTERVALS(12)(32), INTERVALS(2*PI)(32)]))
pillow2 = ROTATIONAL_SOLID([[0.5,0,-2], [0.5,0,-0.3], [1.2,0,-0.3], [1.2,0,-0.1], [4.8,0,-0.1], [4.8,0,0.2]])(2*PI)(32)
pillowBolt = ROTATIONAL_SOLID([[0,0,-3.3], [0.15,0,-3.3], [0.15,0,-3.5], [0.2,0,-3.5], [0.2,0,-3.2]])(2*PI)(6)

# colored:
ligthPillow = STRUCT([pillow1, pillow2, pillowBolt])
darkPillow = STRUCT([BLACK(pillow1), pillow2, pillowBolt])

def pillowRow(n):
	return STRUCT([T([1])([10.4*i])((darkPillow if i%2==0 else ligthPillow)) for i in range(n)])

row1 = STRUCT([ligthPillow, T([1])([10.4])(pillowRow(3)), T([1,2,3])([-2,-.6,-3.2])(CUBOID([35.2,1.2,1.2]))])
row2 = STRUCT([T([1,2,3])([-2,-.6,-3.2])(CUBOID([45.6,1.2,1.2])), ligthPillow, T([1])([10.4])(pillowRow(4))])
row3 = STRUCT([T([1,2,3])([-2,-.6,-3.2])(CUBOID([45.6,1.2,1.2])), pillowRow(5)])
row4 = STRUCT([T([1,2,3])([-2,-.6,-3.2])(CUBOID([35.2,1.2,1.2])), pillowRow(4)])

pillowRows = STRUCT([
	T([3])([16.5])(R([2,3])(-PI/2)(STRUCT([row1, T([1,2])([-5,9])(row2)]))),
	T([2])([16.5])(STRUCT([T([1,2])([-5,-9])(row3), row4]))
])


# Structure:
sofaStructure1 = MAP(TORUS(10,.5))(PROD1x1([INTERVALS(2*PI)(12), INTERVALS(PI/2)(12)]))
sofaStructure2 = T([2])([10])(R([1,3])(PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,12],[.4,0,12.1],[0,0,12.1]])(2*PI)(12)))
sofaStructure3 = T([1])([10])(R([2,3])(PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,12],[.4,0,12.1],[0,0,12.1]])(2*PI)(12)))
sofaStructureLeg1 = T([1,2])([-5,10])(R([2,3])(-PI/2)(ROTATIONAL_SOLID([[.5,0,0],[.5,0,10], [0,0,10]])(2*PI)(12)))
sofaStructureLeg2 = T([1,2])([17.5,15])(R([1,2])(-PI/6)(R([2,3])(PI/2)(ROTATIONAL_SOLID([[0,0,-.2],[.5,0,-.2],[.5,0,15.5]])(2*PI)(12))))
sofaStructure40 = T([1,3])([1.4,-.7])(R([1,3])(PI/2)(STRUCT([
	T([1,2])([.7,.7])(ROTATIONAL_SOLID([[0,0,-.1],[.2,0,-.1],[.2,0,1.5],[0,0,1.5]])(2*PI)(6)), 
	T([2])([1.3])(CUBOID([1.4,.1,1.4])), CUBOID([1.4,1.4,.1]), 
	T([3])([1.3])(CUBOID([1.4,1.4,.1]))])))
sofaStructure4 = STRUCT([
	T([1,2])([8.5,-.5])(R([1,2])(-PI/2)(sofaStructure40)), 
	T([1,2])([8.5,-9.5])(R([1,2])(-PI/2)(sofaStructure40)),
	T([1,2])([-1.9,8.5])(sofaStructure40),
	T([1,2])([-10.9,8.5])(sofaStructure40)
])

sofaStructure = T([1,2,3])([2.5,6.3,6.3])(R([2,3])(-PI/2)(R([1,3])(-PI/2)(STRUCT([sofaStructure1, sofaStructure2, sofaStructure3, sofaStructure4, sofaStructureLeg1, sofaStructureLeg2]))))
sofaStructure = STRUCT([sofaStructure, T([1])([26.2])(sofaStructure)])

sofaFoot1 = T([1,2])([2.5,13.9])(ROTATIONAL_SOLID([[0,0,0],[.4,0,0],[.5,0,.1],[.1,0,.3],[.1,0,.9]])(2*PI)(24))
sofaFoot2 = T([1,2])([2.5,-9.2])(ROTATIONAL_SOLID([[0,0,0],[.4,0,0],[.5,0,.1],[.1,0,.3],[.1,0,.9]])(2*PI)(24))

sofaFoots = STRUCT([sofaFoot1, sofaFoot2, T([1])([26.2]), sofaFoot1, sofaFoot2])

sofa = STRUCT([sofaFoots, T([3])([11.5])(R([2,3])(PI/15)(STRUCT([sofaStructure, pillowRows])))])

VIEW(sofa)
