// Struttura principale:
var facciataComplex = SIMPLICIAL_COMPLEX([[0,0], [0,14], [6,10], [6,0], [21,14], [10,10], [13,10], [17,10], [13,6], [17,6], [10,0], [21,0]])([[0,1,2],[0,2,3],[1,2,4],[2,4,5],[4,5,6],[4,6,7],[5,6,10],[6,8,10],[8,10,11],[8,9,11],[7,9,11],[4,7,11]]);
var facciata = T([1])([1])(R([1,2])(PI/2)(EXTRUDE([1])(facciataComplex)));
var lato = CUBOID([18,1,14]);
var back = T([0,1])([-1,18])(CUBOID([22,1, 14]));
var box = COLOR([1,1,1])(STRUCT([facciata, T([0])([21])(R([0,1])(PI/2)(lato)), R([0,1])(PI/2)(lato), back]));

// tetto
var t1 = COLOR([1,1,1])(T([1])([1])(R([1,2])(PI/2)(EXTRUDE([1])(SIMPLICIAL_COMPLEX([[0,14], [20,14], [10,20]])([[0,1,2]])))));
var t2 = T([1])([20])(R([1,2])(PI/2)(EXTRUDE([21])(SIMPLICIAL_COMPLEX([[-1,14], [0, 14], [10, 21], [10,20], [21,14], [20, 14]])([[0,1,2], [1,2,3], [2,3,4], [3,4,5]]))));
var tetto = STRUCT([t1, T([1])([18])(t1), COLOR([1,0,0])(t2)]);

// porta
var maniglia = T([0,1,2])([3.5,-.1,6])(COLOR([1,.6,0])(CUBOID([0.3,.1,.3])));
var porta = T([0])([6])(R([0,1])(-PI/3)(STRUCT([maniglia, COLOR([.5,.3,.3])(CUBOID([4,0.6,10]))])));

// finestra
var f1 = CUBOID([.1,.1,4]);
var f2 = CUBOID([.85,.1,.1]);
var ff = STRUCT([T([0])([.1])(f2), T([0,2])([.1,1.95])(f2), T([0,2])([.1,3.9])(f2)]);
var vetro = COLOR([.1,.1,.7,.3])(CUBOID([2,0,4]));
var cornice = COLOR([.5,.3,.3])(STRUCT([f1, T([0])([.95])(f1), T([0])([1.90])(f1), ff, T([0])([.95])(ff)]));
var finestra = T([2])([6])(STRUCT([T([0])([13])(cornice), T([0])([13])(vetro)]));

var casa = STRUCT([box, tetto, porta, finestra, T([0])([2])(finestra)]);
//DRAW(casa);

// ground
var garden = COLOR([.1,1,0])(SIMPLICIAL_COMPLEX([[-10,-15], [-10,23], [-1,0], [6,-15], [6,0], [-1,19], [21,19], [21,0], [10,0], [32,23], [10,-15], [32,-15]])([[0,1,2],[0,2,3],[2,3,4],[1,2,5],[1,5,6],[1,6,9],[6,7,9],[7,8,10],[7,10,11],[7,9,11]]));
var pavimento = SIMPLEX_GRID([[0, 20],[-1,17]]);
var vialetto = COLOR([1,.8,0])(T([0,1])([6,-15])(CUBOID([4,16])));
var ground = STRUCT([garden, pavimento, vialetto]);

// staccionata
var paletto = STRUCT([CUBOID([0.8,.3,3]), T([1,2])([.3,3])(R([1,2])(PI/2)(EXTRUDE([.3])(SIMPLICIAL_COMPLEX([[0,0], [.4,1], [.8,0]])([[0,1,2]]))))]);
var paletti = function(n) {
	var p = [paletto];
	for (var i = 0; i<n; i++){
		p.push(T([0])([1]));
		p.push(paletto);
	}
	return STRUCT(p);
}
staccionata = COLOR([.9,.5,.1])(STRUCT([T([0,1])([-10,-15.3])(paletti(15)), T([0,1])([10,-15.3])(paletti(21)), T([0,1])([-10,-15])(R([0,1])(PI/2)(paletti(37))), T([0,1])([-10,23])(paletti(41)), T([0,1])([32.3,-15])(R([0,1])(PI/2)(paletti(37))), T([0,1])([6,-15])(CUBOID([3.8,.3,3])), T([0,1,2])([9,-15.3,2.5])(CUBOID([.3,.1,.3]))]));

var casaCompleta = STRUCT([casa, ground, staccionata]);

var schiera = function(n){
	out = [];
	for (var i = 0; i<n; i++){
		out.push(casaCompleta);
		out.push(T([0])([43]));
	}
	return STRUCT(out);
}

var filaCase = schiera(10);
var filaCase1 = T([0,1])([410,-60])(R([0,1])(PI)(schiera(10)));
var strada = STRUCT([filaCase, filaCase1]);

//DRAW(casaCompleta);
//DRAW(filaCase);
//DRAW(strada);
