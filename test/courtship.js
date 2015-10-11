/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Courtship = require('../courtship.js');
var Creature = require('../creature.js');
var Environment = require('../environment.js');

exports['test the right courtier is selected'] = function (test) {
	var env = new Environment();
	var parent = new Creature(1, buildGenome(), [], 1000);
	var female = new Creature(1, buildGenome(), [parent], 1000);
	var male = new Creature(0, buildGenome(), [parent], 1000);
	var alphamale = new Creature(0, buildAlphaGenome(), [parent], 1000);
	
	var courtship = new Courtship(female);
	courtship.court(male);
	courtship.court(alphamale);
	
	test.equals(alphamale.id, courtship.selectCourtier().id);
	
	test.done();
};

exports['test procreation'] = function (test) {
	var env = new Environment();
	var parent = new Creature(1, buildGenome(), [], 1000);
	env.creatureMap.add(parent.id, parent, 20, 20);
	
	var female = new Creature(1, buildGenome(), [parent], 1000);
	env.creatureMap.add(female.id, female, 20, 20);
	
	var male = new Creature(0, buildGenome(), [parent], 1000);
	env.creatureMap.add(male.id, male, 20, 20);
	
	female.litterSize = function() { return 3; };
	male.breedingRange = function() { return 3; };
	female.breedingRange = function() { return 3; };
	
	//arbitrarily large so we get a full litter
	female.energy = 500;
	
	var courtship = env.displayCourtship(female);
	courtship.court(male);
	var litter = courtship.procreate();
	
	test.equals(female.litterSize(), litter.length, "litter was not the right size");
	
	test.done();
}

function buildGenome() {
	return {"Longevity" : [10, 5], "Size" : [4, 4], "Intelligence" : [5,5], "Speed" : [3, 3], "Prowess" : [3, 5]};
}


function buildAlphaGenome() {
	return {"Longevity" : [10, 5], "Size" : [4, 4], "Intelligence" : [5,5], "Speed" : [3, 3], "Prowess" : [10, 5]};
}
