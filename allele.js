var settings = require('./settings.json');

var Allele = function(value) {
	this.value = value;
}

Allele.prototype.replicate = function() {
	
	var mutationValue = Math.random(),
	    mutatedValue = this.value;
	
	// mutate downward
	if(mutationValue < .5 - settings.mutationRate) {
		mutatedValue  = mutatedValue - 1;
	}
	
	// mutate upward
	if(mutationValue > .5 + settings.mutationRate) {
		mutatedValue = mutatedValue + 1;
	}
	
	return mutatedValue;
}

module.exports = Allele;