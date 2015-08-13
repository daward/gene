var $ = require('jQuery');
var domready = require("domready");
var _ = require('lodash-node');
domready(function () {
	var God = require('./god.js')
	var settings = require('./settings.json');
	var shiva = new God();
	shiva.createTheWorld();

	var gridSize = 30;
	var bw = gridSize * settings.dimensions.width;
	var bh = gridSize * settings.dimensions.length;
	var p = 10;
	
	function initialize() {
		var context = $("#canvas")[0].getContext("2d");
		context.font = "12px Georgia";
		
		$("#year").click(function() {
			shiva.observeTheWorldIHaveCreated();
			drawBoard();
		});
		
		drawBoard();
	}

	function drawBoard(){
		var context = $("#canvas")[0].getContext("2d");
		context.clearRect(0, 0, $("#canvas")[0].width, $("#canvas")[0].height);
		
		for (var x = 0; x <= bw; x += gridSize) {
			context.moveTo(0.5 + x + p, p);
			context.lineTo(0.5 + x + p, bh + p);
		}

		for (var x = 0; x <= bh; x += gridSize) {
			context.moveTo(p, 0.5 + x + p);
			context.lineTo(bw + p, 0.5 + x + p);
		}
		
		for(var x = 0; x < settings.dimensions.width; x++) {
			for(var y = 0; y < settings.dimensions.length; y++) {
				context.fillText(shiva.environment.vegetationMap.get(x, y).size, p + x * gridSize + 5, p + y * gridSize + 15);
			}			
		}
		
		_.forEach(shiva.environment.getAllCreatures(), function(creature) {
			context.fillText("C", p + creature.x * gridSize + 20, p + creature.y * gridSize + 25);
		});
		
		context.strokeStyle = "black";
		context.stroke();		
	}

	initialize();

});