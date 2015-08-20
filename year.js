var _ = require('lodash-node');

var Year = function(lifecycles, getPrey) {
	this.lifecycles = lifecycles;
	this.getPrey = getPrey;
}

Year.prototype.executeYear = function () {
	
	_.forEach(this.lifecycles, function(lifecycle) {
		lifecycle.migrate();
	});
	
	this.eat();
	this.breed();
	
	_.forEach(this.lifecycles, function(lifecycle) {
		lifecycle.surviveWinter();
	});
}

// creatures find their food, and then battle to eat it
Year.prototype.eat = function() {
		
	_.forEach(this.lifecycles, function(lifecycle) {
		lifecycle.findFood();
	});
	
	_.forEach(this.getPrey(), function(prey) {
		prey.data.surviveYear();
	});
}

Year.prototype.breed = function() {
	// now the mating phase
	// first females indicate their willingness to be courted
	_.forEach(this.lifecycles, function(lifecycle) {
		lifecycle.createCourtship();
	});
	
	// then males find the females
	_.forEach(this.lifecycles, function(lifecycle) {
		lifecycle.findMates();
	});

	// then the females give birth (this should probably happen in the spring, but this is simpler
	_.forEach(this.lifecycles, function (lifecycle) {
		lifecycle.procreate();
	});
		
}

module.exports = Year;