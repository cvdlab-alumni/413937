'''
Define plan by plan, with names floor0, floor1, floor2, floor3, and floor4,
the 5 models of horizontal partitions, and add them to the STRUCT of the
building model.
'''
# utils functions:

#execfile("exercise1.py")

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

# floor0:
'''
-----------------__
|   floor00	   \
|		 01/
|		 --
|	floor02	|
|03  -------------
\_/  <-- 04
'''
floor00 = DOMAIN([[2.7,15.1],[6.5,9.85]])([1,1])
floor01 = T([1,2])([15.1,9.85-1.675])((R([1,2])(-PI/2)(circular_sector(PI, 1.675))))
floor02 = DOMAIN([[2.7,13.125],[3.7,6.5]])([1,1])
floor03 = DOMAIN([[2.7,3.8],[2.6,3.7]])([1,1])
floor04 = T([1,2])([3.25,2.6])(R([1,2])(PI)(circular_sector(PI, .55)))
floor0 = EXTRUDE([3,STRUCT([floor00, floor01, floor02, floor03, floor04]),.3])

# floor1:
'''
________________________
|_  	floor10		|
  |	floor11		|
  |			|
  |_____________________|
'''
floor10 = T([1,2,3])([-1.6,8.2,4])(GRID([[9.1,-2.2,8.2],[1.7],[.5]]))
floor11 = T([3])([4])(CUBOID([17.9,8.2,.5]))
floor1 = STRUCT([floor10,floor11])

# floor2:
'''
	________________
	floor20		|
	\		|
	 \21	floor22	|
	  \_____________|
'''
floor20 = T([2,3])([8.2,8])(GRID([[-7.5,1.3,4.375,4.7],[1.7],[.5]]))
floor21 = T([3])([8])(EXTRUDE([3,MKPOL([[[7.5,8.2],[8.8,8.2],[8.8,.4]],[[1,2,3]],None]),.5]))
floor22 = T([1,3])([8.8,8])(CUBOID([9.085,8.2,.5]))
floor2 = STRUCT([floor20, floor21, floor22])

# floor3:
floor30 = T([2,3])([8.75,12])(GRID([[9.15,-4.85,3.5],[1.5],[.5]]))
floor31 = T([3])([12])(CUBOID([17.5, 8.75,.5]))
floor3 = STRUCT([floor30, floor31])

# floor4:
floor4 = T([3])([15.95])(CUBOID([17.9,10,.75]))

ground = T([1,2])([-6,-4])(COLOR([0,1,0])(CUBOID([30,18,-.1])))
floors = T([2])([.4])(STRUCT([floor0, floor1, floor2, floor3, floor4, ground]))


################################################################################
##################################EXERCISE1#####################################
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

################################################################################

building = STRUCT([pillars, floors])

VIEW(building);





