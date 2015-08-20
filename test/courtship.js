/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Courtship = require('../courtship.js');
var Creature = require('../creature.js');
var Environment = require('../environment.js');

exports['test the right courtier is selected'] = function (test) {
	var env = new Environment();
	var parent = new Creature(1, {"Longevity" : [10, 5]}, []);
	var female = new Creature(1, {"Longevity" : [10, 5]}, [parent]);
	var male = new Creature(0, {"Longevity" : [10, 5], "Prowess" : [3, 5]}, [parent]);
	var alphamale = new Creature(0, {"Longevity" : [10, 5], "Prowess" : [10, 5]}, [parent]);
	
	var courtship = new Courtship(female);
	courtship.court(male);
	courtship.court(alphamale);
	
	test.equals(alphamale.id, courtship.selectCourtier().id);
	
	test.done();
};

exports['test procreation'] = function (test) {
	var env = new Environment();
	var parent = new Creature(1, {"Longevity" : [10, 5]}, []);
	env.creatureMap.add(parent.id, parent, 20, 20);
	
	var female = new Creature(1, {"Longevity" : [10, 5]}, [parent]);
	env.creatureMap.add(female.id, female, 20, 20);
	
	var male = new Creature(0, {"Longevity" : [10, 5], "Prowess" : [3, 5]}, [parent]);
	env.creatureMap.add(male.id, male, 20, 20);
	
	female.litterSize = function() { return 3; };
	male.breedingRange = function() { return 3; };
	female.breedingRange = function() { return 3; };
	
	var courtship = env.displayCourtship(female);
	courtship.court(male);
	var litter = courtship.procreate();
	
	test.equals(female.litterSize(), litter.length);
	console.log(litter[0].traits.Longevity.alleles);
	
	test.done();
}
