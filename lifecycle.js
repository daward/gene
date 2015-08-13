var Lifecycle = function(creature, environment) {
	this.creature = creature;
	this.environment = environment;
}

// find all females within the male's range (a function of speed) and attempt to mate with them
Lifecycle.prototype.findMates = function() {
	if(this.creature.sex === 0) {
		var courtships = this.environment.findCourtships(this.creature);

		_(courtships).forEach(function(courtship) {
			courtship.court(this.creature);
		})
	}
}

Lifecycle.prototype.createCourtship = function() {
	if(this.creature.sex === 1 && this.creature.isFertile()) {
		this.environment.displayCourtship(new Courtship(this, this.environment));
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