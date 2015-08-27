/*jslint node: true */
/*jslint plusplus: true */
'use strict';

var EnvironmentMap = require('../environmentmap.js');

exports['test addition'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("test id", "test data", 25, 25);
	
	test.done();
};

exports['test locate'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("test id", "test data", 25, 26);
	
	test.equal(25, map.locate("test id").x)
	test.equal(26, map.locate("test id").y)
	
	test.done();
};

exports['test move'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("test id", "test data", 25, 26);
	map.add("search", "test data", 25, 26);
	map.move("test id", 1, 1);

	test.equal(1, map.locate("test id").x)
	test.equal(1, map.locate("test id").y)
	
	test.equal(0, map.search("search", 1).length);
	
	
	test.done();
};

exports['test move ranged'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("test id", "test data", 25, 26, 1);
	map.add("search", "test data", 25, 26);
	map.move("test id", 1, 1);

	test.equal(1, map.locate("test id").x)
	test.equal(1, map.locate("test id").y)
	
	test.equal(0, map.search("search", 1).length);
	map.move("search", 2, 2);
	test.equal(1, map.search("search", 1).length);
	
	
	test.done();
};

exports['test search'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("a", "test data", 25, 25);
	map.add("b", "test data", 24, 26);
	
	test.equal(1, map.search("b", 1).length);
	test.equal(1, map.search("a", 1).length);
	
	
	test.done();
};

exports['test out of range search'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("x", "test data", 26, 25);
	map.add("y", "test data", 27, 27);
	
	var results = map.search("y", 1);
	
	test.equal(0, results.length);
	
	test.done();
};

exports['test overlapping position'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("a", "test data", 25, 25);
	map.add("b", "test data", 25, 25);
	
	var results = map.search("b", 1);
	
	test.equal(1, results.length);
	
	test.done();
};

exports['test remove'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("a", "test data", 25, 25);
	map.add("b", "test data", 26, 26);
	map.remove("a");
	var results = map.search("b", 1);
	
	test.equal(0, results.length);
	
	test.done();
};

exports['test range add'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.rangeAdd("a", "test data", 25, 25, 1);
	
	// a shouldnt be able to find itself
	test.equal(0, map.search("a", 1).length);
	
	map.add("b", "search point", 25, 25)
	// although a is accessible from many points, it should still only turn up once
	test.equal(1, map.search("b", 1).length);
	test.equal(1, map.search("b", 0).length);
	test.done();
};


exports['test listing everything'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.rangeAdd("a", "test data", 25, 25, 1);
	map.add("b", "search point", 25, 25)
	
	test.equal(2, map.list().length);
	test.done();
};


exports['test wrap-around positions'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("b", "wrapped", 50, 49)
	
	test.equal(0, map.locate("b").x);
	test.equal(49, map.locate("b").y);
	test.done();
};


exports['test wrap-around visibility'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.rangeAdd("a", "wrapped", 49, 49, 1)
	map.add("b", "search", 1, 1)
	
	test.equal(1, map.search("b", 1).length);
	test.done();
};


exports['test wrap-around search'] = function (test) {

	var map = new EnvironmentMap({"width" : 50, "length" : 50});
	map.add("a", "wrapped", 49, 49)
	map.add("b", "search", 0, 0)
	
	test.equal(1, map.search("b", 1).length);
	test.done();
};1111111