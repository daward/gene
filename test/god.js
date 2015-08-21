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