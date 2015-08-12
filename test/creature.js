/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Creature = require('../creature.js');
var Environment = require('../environment.js');

exports['test speciation prevents mating'] = function (test) {
	var env = new Environment();
	var female = new Creature(1, {"Longevity" : [10, 5]}, []);
	var male = new Creature(0, {"Longevity" : [10, 5]}, []);
	test.equals(false, female.canMate(male));

	test.done();
};

exports['test you cant eat yourself'] = function (test) {
	var male = new Creature(0, {"Longevity" : [10, 5]}, []);
	test.equals(false, male.canEat(male));

	test.done();
};

exports['test same species can mate'] = function (test) {
	var env = new Environment();
	var parent = new Creature(1, {"Longevity" : [10, 5]}, []);
	var female = new Creature(1, {"Longevity" : [10, 5]}, [parent]);
	var male = new Creature(0, {"Longevity" : [10, 5]}, [parent]);
	test.equals(true, female.canMate(male));

	test.done();
};