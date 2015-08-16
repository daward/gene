var _ = require('lodash-node');

var Year = function(environment) {
	this.environment = environment;
}

Year.prototype.executeYear = function () {
	var creatures = this.environment.getAllCreatures(), environment = this.environment;
	
	var lifecycles = _.map(creatures, function(creature) {
		return creature.data.beginYear(environment);
	});
	
	this.eat(lifecycles);
	this.breed(lifecycles);
	
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.surviveWinter();
	});
}

// creatures find their food, and then battle to eat it
Year.prototype.eat = function(lifecycles) {
	
	_.forEach(lifecycles, function(lifecycle) {
		lifecycle.migrate();
	});
	
	_.forEach(lifecycles, function(lifecycle) {
		lifecycle.findFood();
	});
	
	var allPrey = _.shuffle(this.environment.getAllPrey());
	
	_.forEach(allPrey, function(prey) {
		prey.surviveYear();
	});
}

Year.prototype.breed = function(lifecycles) {
	// now the mating phase
	// first females indicate their willingness to be courted
	_.forEach(lifecycles, function(lifecycle) {
		lifecycle.createCourtship();
	});
	
	// then males find the females
	_.forEach(lifecycles, function(lifecycle) {
		lifecycle.findMates();
	});	
	
	_.forEach(this.environment.getAllCourtships(), function (courtship) {
		courtship.data.procreate();
	});
}

module.exports = Year;