var uuid = require('./uuid.js');

var Vegetation = function(growthRate, nutrition, energyValue, size) {
	this.growthRate = growthRate;
	this.nutrition = nutrition;
	this.energyValue = energyValue;
	this.size = size;
	this.predators = [];
	this.id = uuid();
}

Vegetation.prototype.grow = function() {
	this.size = this.size + Math.max(this.size * this.growthRate, 1);
}

Vegetation.prototype.energyValue = function () {
	return this.energyValue;
}

Vegetation.prototype.predationScore = function () {
	return 0;
}

Vegetation.prototype.canMate = function(creature) {
	return false;
}

Vegetation.prototype.stalkedBy = function(creature) {
	this.predators.push(creature);
}

Vegetation.prototype.surviveYear = function() {
	var food = this, 
		hungryPredators = _.filter(this.predators, function(predator) { return !predator.full() });
	
	_.sample(hungryPredators, this.size).forEach(function(predator) { predator.eat(this) });
	
	this.size = Math.max(this.size - hungryPredators.length, 0);
	
	this.grow();
}

Vegetation.prototype.nutritionRange = function() {
	return [this.nutrition, this.nutrition];
}


module.exports = Vegetation;