var _ = require('lodash-node');

var Prey = function(creature) {
	this.creature = creature;
	this.predators = [];
}

Prey.prototype.stalkedBy = function(creature) {
	this.predators.push(creature);
}

Prey.prototype.surviveYear = function() {
	
	var i = 0;
	var survived = true;
	while(i < this.predators.length && survived) {
		i = (survived = this.survive(this.predator[i])) ? i + 1 : i;
	}
	
	if(!survived) {
		predators[i].eat(this.creature);
	}	
}

Prey.prototype.survive = function(predator) {
	if(predator.full() || predator.dead()) {
		return true;
	}
	
	var differential = (predator.predationScore() - this.creature.predationScore()) / predator.predationScore();

	// a high differential decreases the chances of survival
	return  differential > Math.random();
}

module.exports = Prey;