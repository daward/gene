var _ = require('lodash-node');

var Prey = function(creature, environment) {
	this.creature = creature;
	this.predators = [];
	this.environment = environment;
}

Prey.prototype.stalkedBy = function(creature) {
	this.predators.push(creature);
}

Prey.prototype.surviveYear = function() {
	
	if(!this.creature.isDead()) {
		var i = 0;
		var survived = true;
		while(i < this.predators.length && survived) {
			survived = this.survive(this.predators[i]);
			if(survived) {
				i = i + 1;
			}
		}
		
		if(!survived) {
			this.predators[i].eat(this);
		}	
	}
}

Prey.prototype.survive = function(predator) {
	if(predator.isFull() || predator.isDead()) {
		return true;
	}
	
	var differential = (predator.predationScore() - this.creature.predationScore()) / predator.predationScore();

	// a low differential decreases the chances of survival
	return  differential < Math.random();
}

Prey.prototype.energyValue = function () {
	return this.creature.energyValue();
}

Prey.prototype.die = function () {
	this.environment.decay(this.creature, "eaten");
}

module.exports = Prey;