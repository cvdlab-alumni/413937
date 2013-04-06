'''
Define, with names pillars0, pillars1, pillars2, and pillars3,
the models of pillars of the 4 house floors,
and put them into the STRUCT of an initial building model.
'''
# import di pyplasm:
#from pyplasm import *

# The Maison Citrohan has two type of pillars: cylindrical and squared ones:
roundedPillar = T([1,2])([.2,.2])(CYLINDER ([.2,4])(12))
squaredPillar = CUBOID([.4,.4,4])

# ...there are also small [squared] pillars...
smallPillar = CUBOID([.25,.25,4])

# pillars0:
pillars0South = NN(5)([roundedPillar, T([1])([4.375])])
# assuming the square shown in citrohan1.pdf as a piece of wall and not a pillar
#pillars0North = [T([2])([8.35]), roundedPillar, T([1])([2.3])(squaredPillar)] + NN(3)([T([1])([4.375]), squaredPillar])
pillars0North = [T([2])([8.35]), roundedPillar] + NN(4)([T([1])([4.375]), squaredPillar])
pillars0 = STRUCT(pillars0South + [T([1])([-4.375 * 5])] + pillars0North)

# pillars1:
pillars1South = NN(5)([squaredPillar, T([1])([4.375])])
pillars1North = [T([2])([8.35])] + NN(3)([squaredPillar, T([1])([4.375])]) + [roundedPillar, T([1])([4.375]), squaredPillar]
pillars1 = STRUCT(pillars1South + [T([1])([-4.375 * 5])] + pillars1North)

# pillars2:
pillars2South = NN(2)([squaredPillar, T([1])([4.375])]) + [T([1])([4.375*2]), squaredPillar]
pillars2North = [T([2])([8.35])] + NN(5)([squaredPillar, T([1])([4.375])])
pillars2 = STRUCT(pillars2South + [T([1])([-17.5])] + pillars2North)

# pillars3:
pillars3South = [T([1])([4.375 * 2]), squaredPillar, T([1])([4.375 * 2]), squaredPillar]
pillars3North = [T([2])([8.35]), T([1,2])([.075,.075])(smallPillar), T([1,2])([4.45,.075])(smallPillar), T([1])([4.375*2])] + NN(3)([squaredPillar, T([1])([4.375])])
pillars3 = STRUCT(pillars3South + [T([1])([-17.5])] + pillars3North)

pillars = STRUCT([pillars0, T([3])([4]), pillars1, T([3])([4]), pillars2, T([3])([4]), pillars3])
building = STRUCT([pillars])

VIEW(building);


