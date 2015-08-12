var Environment = require('Environment');

var Universe = function() {

}

Universe.prototype.executeYear = function () {
	var creatures = Environment.getAllCreatures();
	
	var lifecycles = _.invoke(creatures, function(creature) {
		creature.beginYear();
	});
	
	this.eat(lifecycles);
	this.breed(lifecycles);
	
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.surviveWinter();
	});
}

// creatures find their food, and then battle to eat it
Universe.prototype.eat = function(lifecycles) {
	
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.migrate();
	});
	
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.findFood();
	});
	
	var allPrey = _.shuffle(Environment.getAllPrey());
	
	_(allPrey).forEach(function(prey) {
		prey.surviveYear();
	});
}

Universe.prototype.breed = function(lifecycles) {
	// now the mating phase
	// first females indicate their willingness to be courted
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.createCourtship();
	});
	
	// then males find the females
	_(lifecycles).forEach(function(lifecycle) {
		lifecycle.findMates();
	});	
	
	_(Environment.getAllCourtships()).forEach(function (courtship) {
		courtship.procreate();
	});
}