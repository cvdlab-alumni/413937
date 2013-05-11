from pyplasm import *

################################################################################
############################### UTILS FUNCTIONS: ###############################
################################################################################
'''
A set of util function to work with pyplasm
'''
def DOMAIN2D(domains1D = [INTERVALS(1)(32),INTERVALS(1)(32)]):
	'''
	Create a 2D domain
	Thanks to Marco Liceti
	'''
	dd = PROD([ domains1D[0], domains1D[1] ])
	complex = UKPOL(dd)
	points = complex[0]
	cells = CAT(AA(lambda x: [[x[3],x[1],x[0]],[x[2],x[1],x[3]]])(complex[1]))
	return MKPOL([ points, cells, None ])

def DOMAIN2DI(domains1D = [INTERVALS(1)(32),INTERVALS(1)(32)]):
	'''
	Create a 2D domain - Inverted
	Thanks to Marco Liceti
	'''
	dd = PROD([ domains1D[0], domains1D[1] ])
	complex = UKPOL(dd)
	points = complex[0]
	cells = CAT(AA(lambda x: [[x[0],x[1],x[3]],[x[3],x[1],x[2]]])(complex[1]))
	return MKPOL([ points, cells, None ])

def AAPOINTS(func):
	'''
	Apply a function to all points
	usage:
	AAPOINTS(func)(parameters)(points)
	e.g.: AAPOINTS(SUM)([1,.3,10])([[0,0,0],[1,0,3],[2,0,9]])
	'''
	return lambda operands : lambda args : map(lambda list : [func([operands[i],list[i]]) for i in range(len(list))], args)

def MIRROR(axis):
	'''
	reflect long the y-axis points, useful to create simmetric curves.
	'''
	def MIRROR0(points):
		mirrored = AAPOINTS(PROD)([-1 if n == axis else 1 for n in range(len(points[0]))])(points)
		mirrored.reverse()
		return points + mirrored
	return MIRROR0

def ROT(axis):
	'''
	Rotate points in a very hackish way...
	'''
	return lambda angle : lambda points: [UKPOL(R(axis)(angle)(MKPOL([[p],[[1]], None])))[0][0] for p in points]

def DUPLIROT(axis):
	'''
	Rotate end create n copies of an hpc object.
	Usage: DUPLIROT([axis, axis])(angle)(object)(number)
	e.g.: VIEW(STRUCT(AA(POLYLINE)(DUPLYROT([1,3])(PI/6)(obj)(3))))
	'''
	return lambda alpha: lambda obj : lambda n : STRUCT([R(axis)(alpha*i)(obj) for i in range(n)])

################################################################################
########################### END OF UTILS FUNCTIONS: ############################
################################################################################


################################################################################
################################ EXERCISE 2,3: #################################
################################################################################
domain1D = INTERVALS(1)(24)

wheelSectionPoints = [[0,0],[4,5.5],[8,1],[8,-.5]]
wheelSectionControlPoints = AAPOINTS(PROD)([8,8])([[0,0],[.05,2/3.],[.95,2/3.],[1,0]])
wheelSectionLine1Points = [[0,0],[.1,-1.5]]
wheelSectionLine2Points = [[8,0],[8,-2]]
wheelSectionLine3Points = [[0,0],[0,-2]]
frotWheelSide = STRUCT([MAP(BEZIER(S1)(wheelSectionControlPoints))(domain1D),POLYLINE(wheelSectionLine1Points),POLYLINE(wheelSectionLine2Points)])
rearWheelSide = STRUCT([T([1])([27]),MAP(BEZIER(S1)(wheelSectionControlPoints))(domain1D),POLYLINE(wheelSectionLine3Points)])
wheelsSide = T([1])([-9])(STRUCT([frotWheelSide, rearWheelSide]))

bumperSideLinePoints = [[5.5,0],[0,0],[0,.1],[.2,.1],[.7,.3],[0,.9],[.2,.9]]
bumperSideControlPoints = AAPOINTS(SUM)([.2,.9])([[0,0],[-.5,.75],[-.5,1.5]])
bumperSideUpLinePoints = [[-.3,2.4],[-.6,2.5]]
bumperSide = T([1,2])([-9-5.5+.1,-1.5])(STRUCT([POLYLINE(bumperSideLinePoints),MAP(BEZIER(S1)(bumperSideControlPoints))(domain1D)]))

fenderSideLinePoints = [[-14.7, 0.9], [-15.0, 1.0], [-15.1,1.4]]
fenderSideControlPoints = [[-15.1,1.4],[-12,3.5],[-4,5.5],[-1,5.1]]
fenderSide = STRUCT([MAP(BEZIER(S1)(fenderSideControlPoints))(domain1D),POLYLINE(fenderSideLinePoints)])

glassSidePoints = [[-1,5.1],[5.2,8]]
glassSide = POLYLINE(glassSidePoints)

roofSideControlPoints1 = [[5.2,8], [6.2,8.5],[16.5,8.5],[21,6],[22,6]]
roofSideControlPoints2 = [[22,6], [25,6.5],[29,3.6],[30.5,5]]
roofSide = STRUCT([MAP(BEZIER(S1)(roofSideControlPoints1))(domain1D),MAP(BEZIER(S1)(roofSideControlPoints2))(domain1D)])

backSideControlPoints = [[26,0], [28.5,.5],[30,4],[30.5,5]]
backSide = MAP(BEZIER(S1)(backSideControlPoints))(domain1D)

bottomSidePoints = [[-1,-2],[18,-2]]
bottomSide = POLYLINE(bottomSidePoints)

side = STRUCT([wheelsSide,bumperSide,fenderSide,glassSide,roofSide,backSide,bottomSide])

frontUpControlPoints = MIRROR(1)([[14, 9.5], [14, 9.5], [14, 9.5], [9, 9.5], [8, 9.5], [4, 8], [1, 6], [0, 5.3], [0, 0], [0, 0], [0, 0]])
frontUp = SPLINE(CUBICUBSPLINE(domain1D))(frontUpControlPoints)
sideUpLinePoints1 = [[14,9.5],[29,9.5],[29,9.8]]
sideUpLinePoints2 = AAPOINTS(PROD)([1,-1])(sideUpLinePoints1)
sideUp = STRUCT(AA(POLYLINE)([sideUpLinePoints1,sideUpLinePoints2]))
rearUpControlPoints = MIRROR(1)(AAPOINTS(SUM)([29,0])([[0,9.8],[0,9.8],[0,9.8],[2.7,9.9],[3.5,9.6],[3.5,9.6],[5.5,10],[5.5,10],[10.5,9.7], [16.6,7.5],[16.8,7.3],[17,6.5],[17,6.5],[17.3,6],[17.2,3]]))
rearUp = SPLINE(CUBICUBSPLINE(domain1D))(rearUpControlPoints)
up = STRUCT([frontUp,sideUp,rearUp])

backViewControlPoints = MIRROR(0)([[0,2.2],[0,2.2],[0,2.2],[1,2.2],[1.8,2],[2,1.3],[2,1.3],[6.1,1.3],[6.1,1.3],[6.1,0],[6.1,0],[8.1,0],[8.1,0],[9.3,1.2],[10.1,4],[10.5,5],[10.5,5],[10.3,5.7],[9.5,6.2],[9,6.2],[8.3,6.3],[8.3,6.3],[7.5,7.2],[6.3,8],[6.3,8.1],[5,8.5]])
back = SPLINE(CUBICUBSPLINE(domain1D))(backViewControlPoints)

frontVent = POLYLINE([[-5,2.6],[5,2.6],[5,1],[-5,1],[-5,2.6]])
frontViewControlPoints = MIRROR(0)([[0,0],[0,0],[0,0],[7.9,0],[7.9,0],[7.9,.3],[7.9,.3],[9,1.2],[9.5,2.6],[9.8,4],[10.1,5.5],[10.2,5.6],[10.3,5.5],[10.5,4.5],[9.75,1.6],[8.1,-.3],[8.1,-.3],[9.2,-.3],[9.2,-.3],[9.2,0],[9.2,0],[10,.5],[10.3,1.7],[10.7,4],[10.7,4.2],[10.7,5.5],[10.7,5.7],[10,7.5],[8.3,7.5],[8.3,7.5],[6.3,9.3],[6.4,9.2],[1,9.7]])

front = STRUCT([SPLINE(CUBICUBSPLINE(domain1D))(frontViewControlPoints),frontVent])

exercise2 = STRUCT([R([2,3])(PI/2)(T([1,2])([15.5-22.8,2])(side)),T([1])([-22.8])(up),R([1,2])(PI/2)(R([2,3])(PI/2)(T([3])([22.8])(back))),R([1,2])(PI/2)(R([2,3])(PI/2)(T([3])([-22.8])(front)))])


domain1D = INTERVALS(1)(32)
AWPoints1 = [[0,0,1],[COS(PI/6), SIN(PI/6),1],[COS(PI/6),0,1], [1,.5,1.2], [1,0,1.2],[5,.3,.8],[5,0,.8],[5.5,.4,1],[5.5,0,1],[6,.4,1],[6,0,1], [COS(PI/6), SIN(PI/6),.5],[COS(PI/6),0,.5],[1,.5,.6],[1,0,.6],[5,.3,0],[5,0,0],[5.5,.4,0],[5.5,0,0],[6,.4,0],[6,0,0]]
AWPol1 = MKPOL([AWPoints1,[[1,3,2],[2,3,5,4],[4,5,6,7],[6,7,9,8],[8,9,10,11],[2,4,14,12],[4,6,16,14],[6,8,18,16],[8,10,20,18],[12,14,15,13],[14,16,17,15],[16,18,19,17],[18,20,21,19]],None])
AWPol1 = STRUCT([AWPol1,S([2])(-1)(AWPol1)])
AWPol1 = DUPLIROT([1,2])(PI/3)(AWPol1)(6)
AWPol2 = AAPOINTS(SUM)([6,0,0])(MIRROR(2)([[0, 0, 0], [0, 0, 3], [-0.3, 0, 3], [-0.9, 0, 3.9], [0, 0, 3.9], [0.9, 0, 3.9], [2, 0, 4.2], [2, 0, 4], [0.6, 0, 3], [0.6, 0, 0]]))
AWPol2 = MAP(ROTATIONALSURFACE(BEZIER(S1)(AWPol2)))(DOMAIN2D([INTERVALS(1)(24),INTERVALS(2*PI)(36)]))
AWPol = STRUCT([T([3])([1.5])(AWPol1), AWPol2])
tire1 = AAPOINTS(SUM)([5.5,0,0])(MIRROR(2)([[1,0,3.6],[2,0,3.6],[2.2,0,4],[4,0,4],[4.3,0,3.6]]))
tire = MAP(ROTATIONALSURFACE(BEZIER(S1)(tire1)))(DOMAIN2D([INTERVALS(1)(24), INTERVALS(2*PI)(36) ]))
wheel = STRUCT([AWPol, COLOR([.3,.3,.3])(tire)])
wheelPositoned = T([1,2,3])([-5-7.3,-9,2])(R([2,3])(PI/2)(S([1,2,3])([.4,.4,.4])(wheel)))
wheels12 = STRUCT([wheelPositoned,S([2])([-1])(wheelPositoned)])
wheels = STRUCT([wheels12, T(1)(28)(wheels12)])

exercise3 = wheels
################################################################################
############################# END OF EXERCISE 2,3: #############################
################################################################################

################################################################################
################################# EXERCISE 4: ##################################
################################################################################

# Coords of bezier control points to draw a circle:
circleControlPoints = [[1, 0, 0], [0.99, -0.55, 0], [0.55, -0.99, 0], [0, -1, 0], [0, -1, 0], [-0.55, -0.99, 0], [-0.99, -0.55, 0], [-1, 0, 0], [-1, 0, 0], [-.99,.55,0], [-.55,.99,0], [0,1,0], [0,1,0], [.55,.99,0], [.99,.55,0], [1,0,0]]

# Torus-like part of the steering wheel:
steeringWheel1 = R([1,2])(PI/4)(MAP(ROTATIONALSURFACE(BEZIER(S1)(AAPOINTS(SUM)([7,0,0])(circleControlPoints))))(DOMAIN2D([INTERVALS(1)(24), INTERVALS(3./2*PI)(36)])))

# Bottom part of the steering wheel:
steeringWheelCP1 = ROT([1,2])(PI/4)(AAPOINTS(SUM)([7,0,0])(circleControlPoints))
steeringWheelCP2 = AAPOINTS(SUM)([1,-.5,0])(steeringWheelCP1)
steeringWheelCP3 = AAPOINTS(PROD)([1,-1,1])(steeringWheelCP2)
steeringWheelCP4 = AAPOINTS(PROD)([1,-1,1])(steeringWheelCP1)

steeringWheelCurves = [BEZIER(S1)(steeringWheelCP1), BEZIER(S1)(steeringWheelCP2), BEZIER(S1)(steeringWheelCP3), BEZIER(S1)(steeringWheelCP4)]
steeringWheel2 = MAP(BEZIER(S2)(steeringWheelCurves))(DOMAIN2D())

# Center part of the steering wheel:
steeringWheelCentralCP1 = AAPOINTS(SUM)([0,7,0])(AAPOINTS(PROD)([1,1,.7])(circleControlPoints))
steeringWheelCentralCP2 = AAPOINTS(SUM)([.3,6,0])(AAPOINTS(PROD)([1.2,1.2,.9])(circleControlPoints))
steeringWheelCentralCP3 = AAPOINTS(SUM)([1,4,0])(AAPOINTS(PROD)([1,1.2,.9])(circleControlPoints))
steeringWheelCentralCP4 = AAPOINTS(SUM)([1,2,0])(AAPOINTS(PROD)([2,1.2,.9])(circleControlPoints))
steeringWheelCentralCP5 = AAPOINTS(SUM)([1,1,0])(AAPOINTS(PROD)([5,1.2,.9])(circleControlPoints))
steeringWheelCentralCP6 = AAPOINTS(SUM)([1,0,0])(AAPOINTS(PROD)([5,1.2,.9])(circleControlPoints))

steeringWheelCentralCurves = [BEZIER(S1)(steeringWheelCentralCP1), BEZIER(S1)(steeringWheelCentralCP2), BEZIER(S1)(steeringWheelCentralCP3), BEZIER(S1)(steeringWheelCentralCP4), BEZIER(S1)(steeringWheelCentralCP5), BEZIER(S1)(steeringWheelCentralCP6)]

steeringWheelCentral1 = MAP(BEZIER(S2)(steeringWheelCentralCurves))(DOMAIN2DI())
steeringWheelCentral1 = STRUCT([steeringWheelCentral1, S([2])([-1])(steeringWheelCentral1)])

steeringWheelCentral2 = MAP(ROTATIONALSURFACE(BEZIER(S1)([[0,0,0],[1,0,0],[1,0,.5],[1.3,0,.5],[1.3,0,0]])))(DOMAIN2D([INTERVALS(1)(24), INTERVALS(2*PI)(36)]))

bolt = CYLINDER([.1,.3])(6)
bolts = DUPLIROT([1,2])(PI/3)(T([2,3])([.8,1])(bolt))(6)
steeringWheelCentral = STRUCT([COLOR(BLACK)(T([3])([-.4])(bolts)),T([3])([.5])(steeringWheelCentral2), COLOR([.1,.1,.1])(steeringWheelCentral1)])

steeringWheelGearCP1 = AAPOINTS(PROD)([.5,.5,.5])(MIRROR(2)([[0,0,0],[0,0,1],[.3,0,1],[.3,0,.8],[.2,0,.7],[.2,0,0]]))
steeringWheelGearCP2 = AAPOINTS(SUM)([0,1,0])(AAPOINTS(PROD)([.6,.6,.6])(MIRROR(2)([[0,0,0],[0,0,1],[.3,0,1],[.3,0,.8],[.2,0,.7],[.2,0,0]])))
steeringWheelGearCP3 = AAPOINTS(SUM)([.25,1,0])(AAPOINTS(PROD)([.9,.9,.9])(MIRROR(2)([[0,0,0],[0,0,1],[.3,0,1],[.3,0,.8],[.2,0,.7],[.2,0,0]])))
steeringWheelGearCP4 = AAPOINTS(SUM)([.5,2,.5])(MIRROR(2)([[0,0,0],[0,0,1],[.3,0,1],[.3,0,.8],[.2,0,.7],[.2,0,0]]))
steeringWheelGearCP5 = AAPOINTS(SUM)([.6,2,.5])(AAPOINTS(PROD)([.6,.6,.6])(MIRROR(2)([[0,0,0],[0,0,1],[.3,0,1],[.3,0,.8],[.2,0,.7],[.2,0,0]])))
steeringWheelGearCP6 = AAPOINTS(SUM)([.6,2,.5])([[0,0,0]])
steeringWheelGearCurves = [
	BEZIER(S1)(steeringWheelGearCP6), 
	BEZIER(S1)(steeringWheelGearCP5), 
	BEZIER(S1)(steeringWheelGearCP4), 
	BEZIER(S1)(steeringWheelGearCP3), 
	BEZIER(S1)(steeringWheelGearCP2), 
	BEZIER(S1)(steeringWheelGearCP1)]

steeringWheelGear = STRUCT([
	MAP(BEZIER(S2)(steeringWheelGearCurves))(DOMAIN2DI()), 
	S([2])([-1])(MAP(BEZIER(S2)(steeringWheelGearCurves))(DOMAIN2DI())),
	COLOR(BLACK)(R([1,3])(-PI/2)(CYLINDER([.6,1])(32)))
])
steeringWheelGear = T([3])([-3])(S([1,2,3])([3,3,3])(R([1,3])(PI/2)(steeringWheelGear)))


steeringWheelStripe = R([1,2])(PI)(MAP(ROTATIONALSURFACE(BEZIER(S1)(AAPOINTS(SUM)([7,0,0])(AAPOINTS(PROD)([1.03,1.03,1.03])(circleControlPoints)))))(DOMAIN2D([INTERVALS(1)(24), INTERVALS(.07)(2)])))

steeringWheel = STRUCT([
	COLOR(BLACK)(steeringWheel1),
	COLOR(BLACK)(steeringWheel2),
	steeringWheelCentral,
	COLOR(YELLOW)(steeringWheelStripe),
	steeringWheelGear
	])

exercise4 = T([1,2,3])([-3,-4,5])(R([1,3])(-PI/3)(S([1,2,3])([.3,.3,.3])(steeringWheel)))

total = STRUCT([exercise2,exercise3,exercise4])

VIEW(total)
