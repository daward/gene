var Creature = require('./creature.js');
var _ = require('lodash-node');
var settings = require('./settings.json');
var Trait = require('./trait.js');

var Courtship = function(female, environment) {
	
	if(female.sex === 0) {
		throw "Males cannot start a courtship";
	}
	this.female = female;
	this.courtiers = [];
	this.environment = environment;
}

Courtship.prototype.fertilize = function(male) {
	
	var zygote = {};
	var maleChromosome = Math.floor(Math.random() * 2);
	var femaleChromosome = Math.floor(Math.random() * 2);
	var female = this.female;
	
	_.forEach(settings.traitTypes, function(traitType) {
		if(female.traits[traitType] && male.traits[traitType]) {
			var alleles = [
				female.traits[traitType].reproduce(femaleChromosome),
				male.traits[traitType].reproduce(maleChromosome)
			]
			zygote[traitType] = alleles;
		}
	});
	
	return new Creature(maleChromosome, zygote, this.createAncestry(male));
}

Courtship.prototype.procreate = function() {
	
	if(this.courtiers.length > 0) {
		var litterSize = this.female.litterSize();
		var courtier = this.selectCourtier()
		var retVal = [];
		
		for(var i = 0; i < litterSize; i++) {
			var offspring = this.fertilize(courtier);
			retVal.push(offspring);
			this.environment.birth(offspring, this.female);
		}
		
		return retVal;
	}
}

Courtship.prototype.createAncestry = function(male) {
	var ancestry = []
	ancestry.concat(male.ancestry);
	ancestry.concat(this.female.ancestry);
	
	// prune off the oldest possible ancestor to allow for speciation
	_.remove(ancestry, function(ancestor) {
		return ancestor.generation > settings.oldestGeneration;
	});
	
	// add a generation to the family tree
	ancestry = _(ancestry).forEach(function(ancestor) {
		ancestor.generation++;
	});
	
	// tack on the mother and father
	ancestry.push({"generation" : 0, "id" : this.female.id})
	ancestry.push({"generation" : 0, "id" : male.id})
	
	return ancestry;
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