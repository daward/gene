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
		var litterSize = this.female.litterSize();
		var courtier = this.selectCourtier()
		var retVal = [];
		
		for(var i = 0; i < litterSize; i++) {
			var offspring = this.female.fertilize(courtier);
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