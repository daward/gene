/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Environment = require('../environment.js');
var Courtship = require('../courtship.js');

exports['test birth'] = function (test) {

	var env = new Environment();
	
	var creature = birth(env);	

	test.equal(25, env.creatureMap.locate(creature.id).x);
	test.equal(26, env.creatureMap.locate(creature.id).y);
	
	test.done();
};

exports['test migrate'] = function (test) {

	// i purposely put the creature in the middle of the map
	// without enough turns to get to the edge, so that I don't
	// have to deal with wrap-around, considering I have already tested
	// that in the context of the move function
	var env = new Environment(),
		outofBounds = false,
		moved = false,
		newLocation = null;
	
	var creature = birth(env);	
	creature.range = function() { return 1;}
	var location = env.creatureMap.locate(creature.id);
	
	for(var x = 0; x < 20; x++) {
		env.migrate(creature);
		newLocation = env.creatureMap.locate(creature.id);
				
		if(Math.abs(newLocation.x - location.x) > creature.range() || 
			Math.abs(newLocation.y - location.y) > creature.range()) {
			outofBounds = true;
			console.log(newLocation);
		}
		
		if(newLocation.x != location.x || newLocation.y != location.y) { moved = true;}		
		
		location = newLocation;
	}
	
	test.equal(false, outofBounds);
	test.equal(true, moved);
	
	test.done();
};

exports['test death'] = function (test) {
	var env = new Environment(),
		creature = birth(env);
	env.decay(creature);
	
	test.equal(null, env.creatureMap.locate(creature.id));
	test.done();
}

exports['test hunting for nothing'] = function (test) {
	var env = new Environment(),
		hunter = birth(env);
		
	hunter.range = function() { return 3;}
	hunter.canEat = function(food) { return food.id != this.id }
	env.stalkPrey(hunter);
	
	test.equals(0, env.getAllPrey().length, "No prey expected, but some was found");
	test.done();
}

exports['test hunting with nothing in range'] = function (test) {
	var env = new Environment(),
		hunter = birth(env),
		hunted = birthLocation(env, 10, 10);
		
	hunter.range = function() { return 3;}
	hunter.canEat = function(food) { return food.id != this.id }
	
	env.stalkPrey(hunter);
	
	test.equals(0, env.getAllPrey().length, "No prey expected, but some was found");
	test.done();
}

exports['test hunting, finding prey'] = function (test) {
	var env = new Environment(),
		hunter = birth(env),
		hunted = birthLocation(env, 25, 25);
		
	hunter.range = function() { return 3;}
	hunter.canEat = function(food) { 
		return food.id != this.id 
	}
	
	env.stalkPrey(hunter);
	
	test.equals(1, env.getAllPrey().length, "Did not find the expected number of prey.  Expected 1, but found " + env.getAllPrey().length);
	test.equals(1, env.getAllPrey()[0].data.predators.length, "Prey did not have the expected number of predators");
	test.equals(hunter.id, env.getAllPrey()[0].data.predators[0].id, "Prey was not hunted by the expected predator");
	test.done();
}

exports['test courting display'] = function (test) {
	var env = new Environment(),
		female = birth(env);
		
	female.breedingRange = function() { return 10;};
	
	env.displayCourtship(new Courtship(female, env));
	
	test.equals(1, env.getAllCourtships().length);
	test.done();
}


exports['test finding courtships'] = function (test) {
	var env = new Environment(),
		female = birth(env),
		male = birth(env, 30, 30);
		
	female.breedingRange = function() { return 10;};
	male.breedingRange = function() { return 0; };
	
	env.displayCourtship(new Courtship(female, env));
	var courtships = env.findCourtships(male);
	
	test.equals(1, courtships.length);
	test.done();
}

function birth(env) {
	var creature = {};
	creature.id = "1";
	env.creatureMap.add(creature.id, creature, 25, 26);
	
	return creature;
}

function birthLocation(env, x, y) {
	var creature = {};
	creature.id = "2";
	env.creatureMap.add(creature.id, creature, x, y);
	
	
	return creature;
}
