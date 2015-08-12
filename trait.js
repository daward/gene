var Trait = function(alleles) {
	this.alleles = alleles;
}

Trait.prototype.value = function() {
	return Math.floor((this.alleles[0].value + this.alleles[1].value) / 2);
}

Trait.prototype.range = function() {
	return [this.alleles[0].value, this.alleles[1].value].sort();
}

// a trait reproduces by randomly contributing a replicated allele
Trait.prototype.reproduce = function(index) {
	return this.alleles[index].replicate();
}

module.exports = Trait;