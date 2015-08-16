var settings = require('./settings.json');
var EnvironmentMap = require('./environmentmap.js');
var Courtship = require('./courtship.js');
var Prey = require('./prey.js');
var _ = require('lodash-node');

var Environment = function() {
	this.creatureMap = new EnvironmentMap(settings.dimensions);
	this.courtshipMap = new EnvironmentMap(settings.dimensions);
	this.preyMap = new EnvironmentMap(settings.dimensions);
	this.vegetationMap = new EnvironmentMap(settings.dimensions);
}

// MATING OVERLAY
Environment.prototype.findCourtships = function(male) {
	var location = this.creatureMap.locate(male.id);
	return this.courtshipMap.searchFromLocation(location, male.breedingRange());
}

Environment.prototype.getAllCourtships = function() {
	return this.courtshipMap.list();
}

Environment.prototype.displayCourtship = function(female) {
	var courtship = new Courtship(female, this);
	var location = this.creatureMap.locate(female.id);
	this.courtshipMap.rangeAdd(female.id, courtship, location.x, location.y, female.breedingRange());
}

// CREATURES
Environment.prototype.decay = function(creature) {
	this.creatureMap.remove(creature.id);
}

Environment.prototype.birth = function(offspring, mother) {
	var location = this.creatureMap.locate(mother.id);
	this.creatureMap.add(offspring.id, offspring, location.x, location.y);
}

Environment.prototype.migrate = function(creature) {
	var location = this.creatureMap.locate(creature.id);
	// the distance the creature could possibly move in either direction from its current position
	var distance = creature.range() * 2;
	
	var xDist = Math.floor((distance + .999) * Math.random());
	var yDist = Math.floor((distance + .999) * Math.random());
	
	this.creatureMap.move(
		creature.id, 
		location.x - creature.range() + xDist, 
		location.y - creature.range() + yDist);
}

Environment.prototype.getAllCreatures = function() {
	return this.creatureMap.list();
}

// HUNTING
Environment.prototype.getAllPrey = function () {
	return this.preyMap.list();
}

Environment.prototype.stalkPrey = function(predator) {
	var range = predator.range(),
		preyMap = this.preyMap,
		location = this.creatureMap.locate(predator.id),
		creatureMap = this.creatureMap,
		preyFunc = function(creature) {
			var prey = preyMap.positions[creature.id];
			
			if(!prey) {
				prey = new Prey(creature);
				var location = creatureMap.locate(creature.id);
				preyMap.add(creature.id, prey, location.x, location.y);
			} 
			else {
				prey = prey.data;
			}
			
			return prey;
		},
		foodSources = [
			{"map" : this.creatureMap, "func" : preyFunc}, // look on the creatureMap for prey 
			{"map" : this.vegetationMap, "func" : function(food) { return food;}} // look on the vegetation map for vegetation
		],
		trackFood = this.trackFood;
	
	// go track everything in the food sources
	_.forEach(foodSources, function(foodSource) {
		trackFood(foodSource.map, location, range, predator, foodSource.func)
	})
}

Environment.prototype.trackFood = function(map, location, range, predator, foodFunc) {
	_.forEach(map.searchFromLocation(location, range), function(food) {
		if(predator.canEat(food.data)) {
			foodFunc(food.data).stalkedBy(predator);
		}
	})
}

// VEGETATION
Environment.prototype.plant = function(vegetation, x, y) {
	this.vegetationMap.add(vegetation.id, vegetation, x, y);
}

module.exports = Environment;
