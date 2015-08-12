var _ = require('lodash-node');

var EnvironmentMap = function(dimensions) {
	this.positions = {};
	this.grid = [];
	this.dimensions = dimensions;
	for(var x = 0; x < dimensions.width; x++) {
		this.grid.push([]);
		for(var y = 0; y < dimensions.length; y++) {
			this.grid[x].push([]);
		}
	}
}

EnvironmentMap.prototype.move = function(id, x, y) {
	this.makeInvisible(id);
	this.setPosition(id, x, y);
	this.makeVisible(id);
}

EnvironmentMap.prototype.add = function(id, data, x, y) {
	this.rangeAdd(id, data, x, y, 0);
}

EnvironmentMap.prototype.rangeAdd = function(id, data, x, y, squareRadius) {	
	if(!this.positions[id]) {
		this.positions[id] = {"data" : data, "range" : squareRadius};
	}
	this.setPosition(id, x, y);
	this.makeVisible(id)
}

EnvironmentMap.prototype.get = function(x, y) {
	return this.positions[this.grid[x][y]].data;
}

EnvironmentMap.prototype.setPosition = function(id, x, y) {
	this.positions[id].x = (x + this.dimensions.width) % this.dimensions.width;
	this.positions[id].y = (y + this.dimensions.length) % this.dimensions.length;	
}

EnvironmentMap.prototype.makeVisible = function(id) {
	var grid = this.grid;
	this.scan(id, this.positions[id].range, function(id, x, y) {
		if(!grid[x][y]) {
			grid[x][y] = [];
		}
		grid[x][y].push(id);
	});
}

EnvironmentMap.prototype.makeInvisible = function(id) {
	var grid = this.grid;
	this.scan(id, this.positions[id].range, function(id, x, y) {
		_.remove(grid[x][y], function(val) { return val == id });
	});
}

EnvironmentMap.prototype.locate = function(id) {
	if(this.positions[id]) {
		return {"x" : this.positions[id].x, "y" : this.positions[id].y}
		}
}

EnvironmentMap.prototype.list = function() {
	var retVal = []
	_.forOwn(this.positions, function(value, key) {
		retVal.push({"id" : key, "data" : value.data, "x" : value.x, "y" : value.y})
	});
	return retVal;
}

EnvironmentMap.prototype.remove = function(id) {
	this.makeInvisible(id);	
	delete this.positions[id];
}

EnvironmentMap.prototype.scan = function(id, squareRadius, callback) {
	this.scanFromLocation(this.positions[id], squareRadius, function(x, y) {callback(id, x, y)});
}

EnvironmentMap.prototype.scanFromLocation = function(location, squareRadius, callback) {
	for(var i = location.x - squareRadius; i <= location.x + squareRadius; i++) {
		for(var j = location.y - squareRadius; j <= location.y + squareRadius; j++) {			
			callback((i + this.dimensions.width) % this.dimensions.width, (j + this.dimensions.length) % this.dimensions.length);
		}
	}		
}

EnvironmentMap.prototype.search = function(id, squareRadius) {
	var obj = {}, retVal = [], grid = this.grid, positions = this.positions;
	
	this.scan(id, squareRadius, function(id, x, y) {
		if(grid[x] && grid[x][y]) {
			_.forEach(grid[x][y], function(key) {
				if(key != id) { obj[key] = positions[key].data }
			});
		}
	});
	
	_.forIn(obj, function(value, key) {
		retVal.push({"id" : key, "data" : value }); 
	});
	
	return retVal;
}

EnvironmentMap.prototype.searchFromLocation = function(location, squareRadius) {
	var obj = {}, retVal = [], grid = this.grid, positions = this.positions;
	
	this.scanFromLocation(location, squareRadius, function(x, y) {
		if(grid[x] && grid[x][y]) {
			_.forEach(grid[x][y], function(key) {
				obj[key] = positions[key].data
			});
		}
	});
	
	_.forIn(obj, function(value, key) {
		retVal.push({"id" : key, "data" : value }); 
	});
	
	return retVal;
}

module.exports = EnvironmentMap;