var uuid = require('./uuid.js');
var _ = require('lodash-node');

var Vegetation = function(growthRate, minGrowth, nutrition, energyValue, size, maxSizeMultiplier) {
	this.growthRate = growthRate;
	this.nutrition = nutrition;
	this.energyProvided = energyValue;
	this.size = size;
	this.predators = [];
	this.id = uuid();
	this.minGrowth = minGrowth;
	this.maxSize = maxSizeMultiplier * size;
}

Vegetation.prototype.grow = function() {	
	this.size = Math.min(this.maxSize, this.size + Math.max(this.size * this.growthRate, this.minGrowth));
}

Vegetation.prototype.energyValue = function () {
	return this.energyProvided;
}

Vegetation.prototype.predationScore = function () {
	return -1;
}

Vegetation.prototype.canMate = function(creature) {
	return false;
}

Vegetation.prototype.stalkedBy = function(creature) {
	this.predators.push(creature);
}

Vegetation.prototype.surviveYear = function() {
	var food = this, 
		hungryPredators = _.filter(this.predators, function(predator) { return !predator.isFull() });
	
	if(hungryPredators.length) {
		_.sample(hungryPredators, Math.floor(this.size)).forEach(function(predator) { 
			predator.eat(food) 
		});
	}
	
	this.predators = [];
	
	this.grow();
}

Vegetation.prototype.die = function () {
	if(this.size > 1) {
		this.size--;
	}
}

Vegetation.prototype.nutritionRange = function() {
	return [this.nutrition, this.nutrition];
}


module.exports = Vegetation;