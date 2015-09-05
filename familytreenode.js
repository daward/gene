var uuid = require('./uuid.js');

var FamilyTreeNode = function(id, data, parents) {
	this.id = id;
	this.data = data;
	this.parents = parents
	this.children = [];
}

FamilyTreeNode.prototype.birth = function(father, data) {
	var child = new FamilyTreeNode(uuid(), data, [this, father]);
	this.children.push(child);
	father.sire(child);
}

FamilyTreeNode.prototype.sire = function(child) {
	this.children.push(child);
}

FamilyTreeNode.prototype.ancestry = function(depth) {
	var retVal = {};
	var traversal = function(node, currentDepth, depth, callback) {
		_forEach.(node.parents, function(parent) {
			retVal[parent.id] = {generation : currentDepth, node : node}
			if(currentDepth < depth) {
				callback(node, currentDepth + 1, depth, callback);
			}
		})
	}
	
	traversal(this, 1, depth, traversal);
	return retVal;
}

FamilyTreeNode



module.exports = FamilyTreeNode;
