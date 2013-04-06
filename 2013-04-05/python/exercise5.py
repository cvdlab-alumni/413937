'''
Define with names stair1, stair2, and stair3
(from bottom up to top), and insert within the building model,
the 3 stair models of the building.
'''

# utils functions:

GRID = COMP([INSR(PROD),AA(QUOTE)])

def DOMAIN (dims):
	start = [s for [s,e] in dims]
	end = [e for [s,e] in dims]
	dim = len(dims)
	def DOMAIN1(divs):
		grid = []
		for i in range(len(dims)):
			grid.append([(end[i]-start[i])/float(divs[i]) for c in range(divs[i])])
		return T(range(1,len(dims)+1))(start)(GRID(grid))
	return lambda x: DOMAIN1(x)


def annulus_sector(alpha, r, R):
	domain = DOMAIN([[0,alpha],[r,R]])([36,1])
	def mapping(v):
		a = v[0]
		r = v[1]
		return [r*COS(a), r*SIN(a)]
	return MAP(mapping)(domain)

def circular_sector(alpha, r):
	return annulus_sector(alpha, 0, r)

n=12
depth = 5.5/n
raiser = 4./n * 3
step2D = MKPOL([[[0,0],[0,raiser],[depth,raiser],[depth,raiser/3.]],[[1,3,2],[1,3,4]], None])
ramp2D = STRUCT(NN(n)([step2D,T([1,2])([depth, raiser/3.])]))
ramp3D = R([2,3])(PI/2)(EXTRUDE([3,ramp2D, 1.5]))

stair1 = T([1,2,3])([5,10.3,-.6])(ramp3D)
stair2 = T([1,2,3])([2,10.3,3.82])(ramp3D)
stair3 = T([1,2,3])([8.5,10.3,7.82])(ramp3D)


stairs = STRUCT([stair1, stair2, stair3])



################################################################################
###############################EXERCISE 1,2,3,4#################################
################################################################################
roundedPillar = T([1,2])([.2,.2])(CYLINDER ([.2,4])(12))
squaredPillar = CUBOID([.4,.4,4])
smallPillar = CUBOID([.25,.25,4])

pillars0South = NN(5)([roundedPillar, T([1])([4.375])])
pillars0North = [T([2])([8.35]), roundedPillar] + NN(4)([T([1])([4.375]), squaredPillar])
pillars0 = STRUCT(pillars0South + [T([1])([-4.375 * 5])] + pillars0North)

pillars1South = NN(5)([squaredPillar, T([1])([4.375])])
pillars1North = [T([2])([8.35])] + NN(3)([squaredPillar, T([1])([4.375])]) + [roundedPillar, T([1])([4.375]), squaredPillar]
pillars1 = STRUCT(pillars1South + [T([1])([-4.375 * 5])] + pillars1North)

pillars2South = NN(2)([squaredPillar, T([1])([4.375])]) + [T([1])([4.375*2]), squaredPillar]
pillars2North = [T([2])([8.35])] + NN(5)([squaredPillar, T([1])([4.375])])
pillars2 = STRUCT(pillars2South + [T([1])([-17.5])] + pillars2North)

pillars3South = [T([1])([4.375 * 2]), squaredPillar, T([1])([4.375 * 2]), squaredPillar]
pillars3North = [T([2])([8.35]), T([1,2])([.075,.075])(smallPillar), T([1,2])([4.45,.075])(smallPillar), T([1])([4.375*2])] + NN(3)([squaredPillar, T([1])([4.375])])
pillars3 = STRUCT(pillars3South + [T([1])([-17.5])] + pillars3North)

pillars = STRUCT([pillars0, T([3])([4]), pillars1, T([3])([4]), pillars2, T([3])([4]), pillars3])


floor00 = DOMAIN([[2.7,15.1],[6.5,9.85]])([1,1])
floor01 = T([1,2])([15.1,9.85-1.675])((R([1,2])(-PI/2)(circular_sector(PI, 1.675))))
floor02 = DOMAIN([[2.7,13.125],[3.7,6.5]])([1,1])
floor03 = DOMAIN([[2.7,3.8],[2.6,3.7]])([1,1])
floor04 = T([1,2])([3.25,2.6])(R([1,2])(PI)(circular_sector(PI, .55)))
floor0 = EXTRUDE([3,STRUCT([floor00, floor01, floor02, floor03, floor04]),.3])

floor10 = T([1,2,3])([-1.6,8.2,4])(GRID([[9.1,-2.2,8.2],[1.7],[.5]]))
floor11 = T([3])([4])(CUBOID([17.9,8.2,.5]))
floor1 = STRUCT([floor10,floor11])

floor20 = T([2,3])([8.2,8])(GRID([[-7.5,1.3,4.375,4.7],[1.7],[.5]]))
floor21 = T([3])([8])(EXTRUDE([3,MKPOL([[[7.5,8.2],[8.8,8.2],[8.8,.4]],[[1,2,3]],None]),.5]))
floor22 = T([1,3])([8.8,8])(CUBOID([9.085,8.2,.5]))
floor2 = STRUCT([floor20, floor21, floor22])

floor30 = T([2,3])([8.75,12])(GRID([[9.15,-4.85,3.5],[1.5],[.5]]))
floor31 = T([3])([12])(CUBOID([17.5, 8.75,.5]))
floor3 = STRUCT([floor30, floor31])

floor4 = T([3])([15.95])(CUBOID([17.9,10,.75]))

floors = T([2])([.4])(STRUCT([floor0, floor1, floor2, floor3, floor4]))

north0 = GRID([[-17.5,.4], [.4,-8,1.4,-.45,.4], [-4,12.7]])
north1 = GRID([[-17.5,.4], [-.4,8], [-4,2.15,-1.6,2.15,-1.6,2.15,-1.55,1.5]])
north2 = GRID([[-17.5,.4], [-9.75,.5], [-4,.5,-4,.5,-3.5,.5,-3.3,.4]])
north = STRUCT([north0, north1, north2])

south0 = GRID([[.4], [10.65], [-4,-.5,-3.2,.65,-3.2,1.8,-1.85,1.5]])
south1 = GRID([[.4], [.55,-1.3,.4,-8,.4], [-4,.5,3.2,-.65,3.2,-1.8,-1.85,]])
south2 = GRID([[.4], [.2,-1.9,.2], [-4,-.5,-3.2,-.65,-3.2,-1.8,1.85]])
south3 = GRID([[.4], [-.55,-1.3,-.4,8], [-4,.5]])
south = STRUCT([south0, south1, south2, south3, T([2,3])([.55,4+.5+3.2+.65])(CUBOID([.4, 1.3,3.2]))])

east0 = GRID([[-8.75,.4,-4,4.75], [.4], [-4,12.7]])
east1 = GRID([[8.75], [.4], [-4,9.35,-1.85,1.5]])
east2 = GRID([[-8.75,-.4,4], [.4], [-4,2.1,-1.6,2.1,-1.6,2.1,-1.6,1.6]])
east = STRUCT([east0, east1, east2])

west0 = GRID([[17.9], [-10.25,.4], [-2.9,-.9,2.4,-1.6,2.1,-1.6,5.2]])
west1 = GRID([[15.2], [-10.25,.4], [2.9]])
west2 = GRID([[11.6, -.9,2.7], [-10.25,.4], [-2.9,.9]])
west3 = GRID([[10,-4,3.9], [-10.25,.4], [-2.9,-.9,-2.4,1.6]])
west4 = GRID([[14.2,-.2,.9,-.2,2.4], [-10.25,.4], [-2.9,-.9,-2.4,-1.6,-2.1,1.6]])
west = STRUCT([west0, west1, west2, west3, west4])

vertical_enclosures = STRUCT([north, south, east, west])


big_window_horiz_bar = COLOR([0,0,0])(R([2,3])(-PI/2)(STRUCT(NN(3)([CYLINDER([.1,8])(12), T([2])([-1.6])]))))
big_window_vert_bar = COLOR([0,0,0])(STRUCT(NN(5)([CYLINDER([.1,3.2])(12), T([2])([2])])))
big_window_bars = STRUCT([big_window_horiz_bar, big_window_vert_bar])
big_window_glass = COLOR([.1,1,1,.9])(T([1])([.05])(CUBOID([.01,8,3.2])))
big_window = STRUCT([big_window_bars, big_window_glass])

balcony_bars = COLOR([0,0,0])(R([3,2])(PI/2)((R([1,3])(-PI/2)(STRUCT(NN(3)([T([2])([-.3]) ,CYLINDER([.05,1.6])(12)]))))))
balcony_wall = (CUBOID([.2,1.7,1.1]))
balcony = STRUCT([T([2])([.2])(balcony_bars), T([1])([-.1])(balcony_wall), T([2])([1.5])(balcony_bars)])

windows = STRUCT([T([1,2,3])([-1.5,8.6,4.5])(balcony), T([1,2,3])([-.1,.5,4.5])(big_window), T([1,2,3])([-.1,.5,8.4])(big_window)])


################################################################################


building = STRUCT([pillars, floors, vertical_enclosures, windows, stairs])

VIEW(building);
