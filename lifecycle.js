
var _ = require('lodash-node');

var Lifecycle = function(creature, environment) {
	this.creature = creature;
	this.environment = environment;
}

// find all females within the male's range (a function of speed) and attempt to mate with them
Lifecycle.prototype.findMates = function() {
	var creature = this.creature;
	if(creature.sex === 0) {
		_.forEach(this.environment.findCourtships(creature), function(courtship) {
			courtship.data.court(creature);
		})
	}
}

Lifecycle.prototype.createCourtship = function() {
	if(this.creature.sex === 1 && this.creature.isFertile()) {
		this.environment.displayCourtship(this.creature);
	}
}

Lifecycle.prototype.findFood = function() {
	// returns an array of creatures in the area
	var prey = this.environment.stalkPrey(this.creature);
}

Lifecycle.prototype.migrate = function() {
	this.environment.migrate(this.creature);
}

Lifecycle.prototype.surviveWinter = function () {
	this.creature.energy = this.creature.energy - this.creature.energyUsed();
	
	// if the creature is out of energy or is too old, it dies
	if((this.creature.age > this.naturalDeathAge) || this.creature.energy <= 0) { 
		this.creature.die();
	}
}

module.exports = Lifecycle;