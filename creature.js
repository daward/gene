var settings = require('./settings.json');
var uuid = require('./uuid.js');
var _ = require('lodash-node');
var rand = require('randgen');
var Trait = require('./trait.js');
var Allele = require('./allele.js');
var Lifecycle = require('./lifecycle.js');

// Traits
// ------------
// Intelligence
// ------------
// Benefit: The combination of size, intelligence, speed and prowess determines if the creature will eat or be eaten
// Negative: Greatly increases energy used
// Limitation: Intelligence cannot exceed longevity
//
// ------------
// Size
// ------------
// Benefit: The combination of size, intelligence, speed and prowess determines if the creature will eat or be eaten
// Negative: Increases energy used
//
// ------------
// Prowess
// ------------
// Benefit: In the event of a breeding tie (two males want to breed with one female) the higher prowess will succeed
// Negative: The combination of size, intelligence, speed and prowess determines if the creature will eat or be eaten
//
// ------------
// Nutrition
// ------------
// Determines a range of values that the creature can eat, but also means they can be eaten by creatures with their value.
// For example, a creature with a nutritional value of 10-10 can only eat creatures that have a nutritional value of 10 (could be 6-12 for example)
//
// ------------
// Fertility
// ------------
// Benefit: Higher fertility means the creature will produce more offspring
// Negative: Significant energy use 
//
// ------------
// Longevity
// ------------
// Benefit: Higher longevity means the species lives longer before dying of old age
//			Allows creatures to manifest higher intelligence and size
// Negative: Breeding age increased
//
// ------------
// Speed
// ------------
// Benefit: Increases the range that food and mates can be found
// Benefit: The combination of size, intelligence and speed determines if the creature will eat or be eaten
// Negative: Breeding age increased
// Limitation: Speed cannot exceed size


var Creature = function(sex, alleleValues, ancestry, startingEnergy) {
	
	this.traits = _.mapValues(alleleValues, function(alleleValue) { 
		return new Trait(_.mapValues(alleleValue, function(value) {
			return new Allele(value);
		})); 
	}); 
	this.sex = sex;
	this.id = uuid();
	this.ancestry = ancestry;
	
	if(!startingEnergy) {
		throw "Can't birth a creature with no energy";
	}
	
	this.energy = startingEnergy;
	this.age = 0;
	this.naturalDeathAge = Math.round(rand.rnorm(this.expectedLifespan(), Math.round(this.expectedLifespan() * .3)));
	this.dead = false;
}

// ACTIONS

Creature.prototype.beginYear = function(environment) {
	this.age++;
	return new Lifecycle(this, environment);
}

Creature.prototype.eat = function(food) {
	this.energy = this.energy + food.energyValue();
	food.die();	
}

Creature.prototype.fertilize = function(male, energy) {
	
	var zygote = {};
	var maleChromosome = Math.floor(Math.random() * 2);
	var femaleChromosome = Math.floor(Math.random() * 2);
	var female = this;
	
	_.forEach(settings.traitTypes, function(traitType) {
		if(female.traits[traitType] && male.traits[traitType]) {
			var alleles = [
				female.traits[traitType].reproduce(femaleChromosome),
				male.traits[traitType].reproduce(maleChromosome)
			]
			zygote[traitType] = alleles;
		}
	});
	
	return new Creature(maleChromosome, zygote, this.createAncestry(male), energy);
}

Creature.prototype.createAncestry = function (male) {
	var ancestry = []
	ancestry = ancestry.concat(male.ancestry);
	ancestry = ancestry.concat(this.ancestry);
	
	// prune off the oldest possible ancestor to allow for speciation
	_.remove(ancestry, function(ancestor) {
		return ancestor.generation > settings.oldestGeneration;
	});
	
	// add a generation to the family tree
	_.forEach(ancestry, function(ancestor) {
		ancestor.generation++;
	});
	
	// tack on the mother and father
	ancestry.push({"generation" : 0, "id" : this.id})
	ancestry.push({"generation" : 0, "id" : male.id})
	
	return ancestry;
}


// STATE
Creature.prototype.isFertile = function () {
	return this.age > this.fertilityAge();
}

Creature.prototype.isFull = function () {
	this.energy >= this.maxEnergy();
}

Creature.prototype.isDead = function () {
	return this.dead;	
}

Creature.prototype.canEat = function(food) {
	var creature = this;
	// to eat... 
	// first off, you're not harry carry as a hot dog, so don't eat yourself
	// the creature must be higher in the food chain (predationScore)
	// it can't be cannibalism
	// it has to be nutritious
	return  food.id != this.id &&
			this.predationScore() > food.predationScore() && 
			!food.canMate(this) &&
			_.some(food.nutritionRange(), function(value) { return _.inRange(value, creature.nutritionRange()[0], creature.nutritionRange()[1] + 1) });
}

Creature.prototype.canMate = function(creature) {
	return _.intersection(_.map(this.ancestry, "id"), _.map(creature.ancestry, "id")).length > 0;
}

// MANIFESTATIONS
// A male's breeding range is just its range, while a female's breeding range is a function
// of her prowess... her ability to be detected by mates
Creature.prototype.breedingRange = function() {
	if(this.sex === 0) {
		return this.range();
	} else if(this.sex === 1) {
		return Math.floor(Math.sqrt(this.traits.Prowess.value()));
	}
}

Creature.prototype.nutritionRange = function() {
	return this.traits.Nutrition.range();
}

// returns a function of speed that will be the distance the creature can travel
// during the turn for migration, hunting or breeding purposes
Creature.prototype.range = function() {
	return Math.floor(Math.sqrt(this.traits.Speed.value()));
}

// returns a value that is the combination of speed, intelligence, size and prowess
// that determines how able one creature is to eat another 
Creature.prototype.predationScore = function() {
	return this.traits.Intelligence.value() + this.traits.Size.value() + this.traits.Speed.value() - this.traits.Prowess.value();
}

// determines how much energy this creature is worth, if eaten
Creature.prototype.energyValue = function() {
	return this.traits.Size.value() * 2;
}

// the energy used is a function of the creature's size, intelligence, speed, prowess and if they have bred, their fertility
Creature.prototype.energyUsed = function() {
	return this.traits.Size.value() + this.traits.Intelligence.value() + this.traits.Speed.value() + Math.floor(Math.sqrt(this.traits.Prowess.value()));
}

// the normalized mean the creature should live, given a longevity and adequate health
Creature.prototype.expectedLifespan = function () {
	return Math.log(this.traits.Longevity.value() + 2) * 10;
}

// the age a creature can first engage in breeding, which is a function of longevity
Creature.prototype.fertilityAge = function() {
	return Math.floor(this.expectedLifespan() * .3);
}

// the maximium amount of energy the creature can store before becoming full
// this is a function of size and intelligence
Creature.prototype.maxEnergy = function () {
	return this.traits.Size.value() + this.traits.Intelligence.value();
}

Creature.prototype.litterSize = function () {
	return this.traits.Fertility.value()
}

Creature.prototype.prowess = function () {
	return this.traits.Prowess.value();
}

module.exports = Creature;