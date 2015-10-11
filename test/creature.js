/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Creature = require('../creature.js');
var Environment = require('../environment.js');

exports['test you cant eat yourself'] = function (test) {
	var male = new Creature(0, buildGenome(), [], 1000);
	test.equals(false, male.canEat(male));

	test.done();
};

exports['test speciation prevents mating'] = function (test) {
	var female = new Creature(1, buildGenome(), [{"generation" : 0, "id" : "lsdjf"}], 1000);
	var male = new Creature(0, buildGenome(), [{"generation" : 0, "id" : "dsf"}], 1000);

	test.equals(false, female.canMate(male));

	test.done();
};

exports['test same species can mate'] = function (test) {
	var female = new Creature(1, buildGenome(), [{"generation" : 0, "id" : "lsdjf"}], 1000);
	var male = new Creature(0, buildGenome(), [{"generation" : 0, "id" : "lsdjf"}], 1000);

	test.equals(true, female.canMate(male));

	test.done();
};

exports['test unqiues'] = function (test) {
	var uniques = {}
	
	for(var i = 0; i < 1000; i++) {
		var female = new Creature(1, buildGenome(), [{"generation" : 0, "id" : "lsdjf"}], 1000);
		test.ok(!uniques[female.id])
		uniques[female.id] = female;
	}
	test.done();
};

function buildGenome() {
	return {"Longevity" : [10, 5], "Size" : [4, 4], "Intelligence" : [5,5], "Speed" : [3, 3], "Prowess" : [7, 7]};
}
