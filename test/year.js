/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var Year = require('../year.js');
var Environment = require('../environment.js');
var God = require('../god.js');
var Creature = require('../creature.js');
var Courtship = require('../courtship.js');
var _ = require('lodash-node');

exports['test breed'] = function (test) {
	var shiva = new God();
	var genome = shiva.letThereBeAGenome(), 
		creatures = [];
	
	creatures.push(new Creature(0, genome, 'adf'));
	creatures.push(new Creature(1, genome, 'adf'));
	
	for(var i = 0; i < creatures.length; i++) {
		creatures[i].fertilityAge = function () { return 0; }
		shiva.environment.creatureMap.add(creatures[i].id, creatures[i], 5, 5)
	}
		
	var lifecycles = _.map(creatures, function(creature) {
		return creature.beginYear(shiva.environment);
	});
	
	var year = new Year(shiva.environment);
	
	year.breed(lifecycles);
	
	test.equals(1, shiva.environment.getAllCourtships().length)
	test.ok(2 < shiva.environment.getAllCreatures().length)
	
	
	test.done();
};