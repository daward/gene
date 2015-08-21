/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var God = require('../god.js');

exports['test creation'] = function (test) {
	var shiva = new God();
	shiva.createTheWorld();
	test.done();
};

exports['test creation next year'] = function (test) {
	var shiva = new God();
	shiva.createTheWorld();
	shiva.observeTheWorldIHaveCreated();
	test.done();
};

exports['test creation two years'] = function (test) {
	var shiva = new God();
	shiva.createTheWorld();
	shiva.observeTheWorldIHaveCreated();
	shiva.observeTheWorldIHaveCreated();
	test.done();
};

exports['test creation many years'] = function (test) {
	var shiva = new God();
	shiva.createTheWorld();
	
	for(var i = 0; i < 20; i++) {
		shiva.observeTheWorldIHaveCreated();
		console.log(shiva.environment.getAllCreatures().length);
		console.log(shiva.environment.deathReasons);
	}
	
	
	
	test.done();
};