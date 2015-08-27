/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Year = require('../year.js');
var Environment = require('../environment.js');
var God = require('../god.js');
var Creature = require('../creature.js');
var Courtship = require('../courtship.js');
var _ = require('lodash-node');
var Vegetation = require('../vegetation.js');

exports['test breed'] = function (test) {
		
	initializeBreedingWorld(function(creatures, shiva, year)
	{
		_.forEach(creatures, function(creature) {
			creature.fertilityAge = function () { return 0; }
			creature.energy = 1000;
		});
		
		year.breed();
		
		test.ok(2 < shiva.environment.getAllCreatures().length, "too few creatures! " + shiva.environment.getAllCreatures().length)
		
	})	
	test.done();
};

exports['test immaturity'] = function (test) {
		
	initializeBreedingWorld(function(creatures, shiva, year)
	{
		_.forEach(creatures, function(creature) {
			creature.fertilityAge = function () { return 5; }
		});
		
		year.breed();
		
		test.equals(0, shiva.environment.getAllCourtships().length)
		test.equals(2, shiva.environment.getAllCreatures().length)
		
	})	
	test.done();
};

exports['test next spring breeding'] = function (test) {
		
	initializeBreedingWorld(function(creatures, shiva, year) {
		_.forEach(creatures, function(creature) {
			creature.fertilityAge = function () { return 0; }
		});
		
		year.breed();
		
		test.equals(0, shiva.environment.getAllCourtships().length)
		
	})	
	test.done();
};

exports['test hunt'] = function (test) {
	
	initializeHuntingWorld(function(creatures, shiva, year) {
		creatures[1].predationScore = function() { return 1000; }
		creatures[1].nutritionRange = function() { return [4, 4]; }
		creatures[0].predationScore = function() { return 0; }
		creatures[0].nutritionRange = function() { return [4, 4]; }
		
		year.eat();
		test.equals(1, shiva.environment.getAllCreatures().length)
		test.equals(true, creatures[0].isDead());
		
	});
	test.done();
}

exports['test mismatched hunt'] = function (test) {
	
	initializeHuntingWorld(function(creatures, shiva, year) {
		creatures[1].predationScore = function() { return 1000; }
		creatures[1].nutritionRange = function() { return [4, 4]; }
		creatures[0].predationScore = function() { return 0; }
		creatures[0].nutritionRange = function() { return [2, 3]; }
		
		year.eat();
		test.equals(2, shiva.environment.getAllCreatures().length)
		test.equals(false, creatures[0].isDead());
		
	});
	test.done();
}

exports['test herbivore'] = function (test) {
	
	initializeHerbivoreWorld(1, function(creatures, shiva, year, vegetation) {
		creatures[0].predationScore = function() { return 0; }
		creatures[0].nutritionRange = function() { return [4, 4]; }
		
		
		var energy = creatures[0].energy;
		
		var size = vegetation.size;
		year.eat();
		
		test.equals(1, shiva.environment.getAllCreatures().length)
		test.equals(false, creatures[0].isDead());
		test.ok(energy + vegetation.energyValue() === creatures[0].energy);
		test.equals((size - 1) * (1 + vegetation.growthRate), vegetation.size);
	});
	test.done();
}


exports['test multi herbivore'] = function (test) {
	
	initializeHerbivoreWorld(2, function(creatures, shiva, year, vegetation) {
		creatures[0].predationScore = function() { return 0; }
		creatures[0].nutritionRange = function() { return [4, 4]; }
		creatures[1].predationScore = function() { return 0; }
		creatures[1].nutritionRange = function() { return [4, 4]; }
				
		var energy = creatures[0].energy;
		
		var size = vegetation.size;
		year.eat();
		
		test.equals(2, shiva.environment.getAllCreatures().length)
		test.equals(false, creatures[0].isDead());
		test.ok(energy + vegetation.energyValue() === creatures[0].energy);
		test.equals((size - 2) * (1 + vegetation.growthRate), vegetation.size);
	});
	test.done();
}

function initializeBreedingWorld(callback) {
	
	var shiva = new God();
	var genome = shiva.letThereBeAGenome(), 
		creatures = [];
	
	creatures.push(new Creature(0, genome, [ {"generation" : 0, "id" :"adf"} ], 15));
	creatures.push(new Creature(1, genome, [ {"generation" : 0, "id" :"adf"} ], 15));
	
	for(var i = 0; i < creatures.length; i++) {
		shiva.environment.creatureMap.add(creatures[i].id, creatures[i], 5, 5)
	}
	
	var lifecycles = _.map(creatures, function(creature) {
		return creature.beginYear(shiva.environment);
	});
	
	var year = new Year(lifecycles, null);
	
	callback(creatures, shiva, year);
	
}

function initializeHuntingWorld(callback) {
	
	var shiva = new God();
	var genome = shiva.letThereBeAGenome(), 
		creatures = [];
	
	creatures.push(new Creature(0, genome, [ {"generation" : 0, "id" :"adf"} ], 15));
	creatures.push(new Creature(1, genome, [ {"generation" : 0, "id" :"adfx"} ], 15));
	
	for(var i = 0; i < creatures.length; i++) {
		shiva.environment.creatureMap.add(creatures[i].id, creatures[i], 5, 5)
	}
	
	var lifecycles = _.map(creatures, function(creature) {
		return creature.beginYear(shiva.environment);
	});
	
	var year = new Year(lifecycles, function() { return shiva.environment.getFood() });
	
	
	callback(creatures, shiva, year);
	
}

function initializeHerbivoreWorld(num, callback) {
	
	var shiva = new God();
	var genome = shiva.letThereBeAGenome(), 
		creatures = [];
	
	for(var i = 0; i < num; i++) {
		creatures.push(new Creature(0, genome, [ {"generation" : 0, "id" :"adf"} ], 15));
	}
	
	for(var i = 0; i < creatures.length; i++) {
		shiva.environment.creatureMap.add(creatures[i].id, creatures[i], 5, 5)
	}
	
	var vegetation = new Vegetation(.5, 2, 4, 10, 10, 2)
	// plant it right on top of the creature
	shiva.environment.plant(vegetation, 5, 5);
	
	var lifecycles = _.map(creatures, function(creature) {
		return creature.beginYear(shiva.environment);
	});
	
	var year = new Year(lifecycles, function() { return shiva.environment.getFood() });
	
	callback(creatures, shiva, year, vegetation);
	
}