var _ = require('lodash-node');
var settings = require('./settings.json');
var uuid = require('./uuid.js');

var Courtship = function(female, environment) {
	
	if(female.sex === 0) {
		throw "Males cannot start a courtship";
	}
	this.female = female;
	this.courtiers = [];
	this.environment = environment;
	this.id = uuid();
}

Courtship.prototype.procreate = function() {
	
	this.environment.courtshipMap.remove(this.female.id);
	if(this.courtiers.length > 0) {
		var courtier = this.selectCourtier()
		var retVal = [];
		var excessEnergy = this.female.energy - this.female.energyUsed();
		
		var litterSize = Math.min(this.female.litterSize(), excessEnergy)
		var startingEnergy = Math.floor(excessEnergy / litterSize);
		
		this.female.energy = this.female.energy - (startingEnergy * litterSize)
		
		for(var i = 0; i < litterSize; i++) {
			var offspring = this.female.fertilize(courtier, startingEnergy);
			retVal.push(offspring);
			this.environment.birth(offspring, this.female);
		}
		
		return retVal;
	}
}

Courtship.prototype.selectCourtier = function() {
	return _.max(this.courtiers, function(courtier) {
		return courtier.prowess();
	});
}

Courtship.prototype.court = function(male) {
	if(male.sex === 1) {
		throw "Females cannot impregnate";
	}

	if(this.female.canMate(male)) {
		this.courtiers.push(male);
	}
}
 module.exports = Courtship;