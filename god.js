var Environment = require('./environment.js');
var Vegetation = require('./vegetation.js');
var Creature = require('./creature.js');
var _ = require('lodash-node');
var uuid = require('./uuid.js');
var settings = require('./settings.json');
var Year = require('./year.js');

// sweet, I get to write a god class and not feel guilty!
var God = function () {
	this.environment = new Environment();
}

God.prototype.letThereBePlants = function() {
	for(var x = 0; x < settings.dimensions.width; x++) {
		for(var y = 0; y < settings.dimensions.length; y++) {
			var vegetation = new Vegetation(
				Math.random(),
				_.random(.3, 1),
				_.random(1, 5),
				_.random(0, 10),
				_.random(0, 10),
				_.random(3, 6));
				
			this.environment.plant(vegetation, x, y);
		}
	}
}

God.prototype.observeTheWorldIHaveCreated = function () {
	var creatures = this.environment.getAllCreatures(), environment = this.environment;
	
	var lifecycles = _.map(creatures, function(creature) {
		return creature.data.beginYear(environment);
	});
	
	var year = new Year(lifecycles, function() { return environment.getFood() }) 
		
	year.executeYear();
}

God.prototype.createTheWorld = function() {
	var creatureTypes = _.random(10, 20);
	
	for(var i = 0; i < creatureTypes; i++) {
		this.letThereBeCreatures();
	}
	this.letThereBePlants();
}

God.prototype.letThereBeCreatures = function() {
	var genome = this.letThereBeAGenome(),
		godId = uuid(),
		creatures = [],
		x = _.random(0, settings.dimensions.width - 1),
		y = _.random(0, settings.dimensions.length - 1),
		quant = _.random(0, 8);
		
	
	creatures.push(new Creature(0, genome, [ {"generation" : 0, "id" :godId} ], _.random(5, 10)));
	creatures.push(new Creature(1, genome, [{"generation" : 0, "id" :godId} ], _.random(5, 10)));
	
	for(var i = 0; i < quant; i++) {
		creatures.push(new Creature(_.random(0, 1), genome, [{"generation" : 0, "id" :godId} ], _.random(5, 100)));
	}
	
	for(var i = 0; i < creatures.length; i++) {
		this.environment.creatureMap.add(creatures[i].id, creatures[i], x, y)
	}	
}

God.prototype.letThereBeAGenome = function() {
	var genome = [];
	_.forEach(settings.traitTypes, function(traitType) {
		var seed = _.random(2, 10)
		genome[traitType] = [seed, _.random(seed - 1, seed + 1)];
	});
	return genome;
}

God.prototype.rest = function() {
	
}

module.exports = God;