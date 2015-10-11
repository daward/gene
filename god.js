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
	this.maxEnergy = 10;
	this.maxSize = 10;
	this.maxGrowthRate = 1;
	this.minGrowthRate = .3;
	this.minNutrition = 1;
	this.maxNutrition = 10;
	this.minSizeMultiplier = 3;
	this.maxSizeMultiplier = 6
	this.maxBreedingPairsPerColony = 10;
	this.minColonies = 15;
	this.maxColonies = 30;
}

God.prototype.letThereBePlants = function() {
	var nutridiff = (this.maxNutrition - this.minNutrition) 
	var equator = settings.dimensions.length / 2
	for(var x = 0; x < settings.dimensions.width; x++) {
		for(var y = 0; y < settings.dimensions.length; y++) {
			
			var inverselatitude = equator - Math.abs(y - equator);
			
			var maxlatitudePct = Math.min(equator, (inverselatitude + 5)) / equator;
			var minlatitudePct = Math.max(0, (inverselatitude - 5)) / equator;
			
			var vegetation = new Vegetation(
				Math.random(),
				_.random(this.minGrowthRate, this.maxGrowthRate),
				_.random(nutridiff * minlatitudePct + this.minNutrition, nutridiff * maxlatitudePct + this.minNutrition),
				_.random(0, this.maxEnergy),
				_.random(0, this.maxSize),
				_.random(this.minSizeMultiplier, this.maxSizeMultiplier));
				
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
	var colonies = _.random(this.minColonies, this.maxColonies);
	
	for(var i = 0; i < colonies; i++) {
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
		quant = _.random(0, (this.maxBreedingPairsPerColony - 1) * 2);
		
	
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