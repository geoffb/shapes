/**
 * Namespace and basic objects
 */

var Game = {};

(function() {
	var G = Game;
	G.Vector = function(x, y) {
		this.x = x;
		this.y = y;
	};
	var proto = G.Vector.prototype;
	proto.magnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	proto.normalize = function() {
		var m = this.magnitude();
		this.x /= m;
		this.y /= m;
	};
	proto.reverse = function() {
		this.x = -this.x;
		this.y = -this.y;
	};
	
	
	proto.add = function(vector) {
		return new G.Vector(this.x + vector.x, this.y + vector.y);
	};
	proto.sub = function(vector) {
		return new G.Vector(this.x - vector.x, this.y - vector.y);
	};
	proto.dotProduct = function(vector) {
		return this.x * vector.x + this.y + vector.y;
	};
	proto.divScalar = function(scalar) {
		return new G.Vector(Math.floor(this.x / scalar), Math.floor(this.y / scalar));
	};
	proto.multScalar = function(scalar) {
		return new G.Vector(this.x * scalar, this.y * scalar);
	};
	proto.copy = function() {
		return new G.Vector(this.x, this.y);
	};
	proto.within = function(pixels, vector) {
		var diff = this.sub(vector);
		return (Math.abs(diff.x) < pixels && Math.abs(diff.y) < pixels);
	};
	proto.chase = function(vector) {
		// TODO: Probably a better way to do this
		var direction = new G.Vector(0, 0);
		if (vector.x < this.x) { direction.x = -1; }
		if (vector.x > this.x) { direction.x = 1; }
		if (vector.x === this.x) { direction.x = 0; }
		if (vector.y < this.y) { direction.y = -1; }
		if (vector.y > this.y) { direction.y = 1; }
		if (vector.y === this.y) { direction.y = 0; }
		return direction;
	};
})();

(function() {
	var G = Game;
	G.Rect = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	};
	var proto = G.Rect.prototype;
	proto.intersect = function(rect) {
		return !(
			this.x > (rect.x + rect.w) || 
			(this.x + this.w) < rect.x || 
			this.y > (rect.y + rect.h) || 
			(this.y + this.h) < rect.y
		);
	};
	proto.contains = function(rect) {
		// TODO: write this function
		return false;
	};
})();

Game.util = {
	randomRange:function(min, max) {
		return Math.floor(Math.random() * ((max - min) + 1)) + min;
	},
	chance:function(percent) {
		var number = Game.util.randomRange(0, 100);
		return number <= percent;
	},
	randomDirection:function() {
		var x = (Math.random() * 2) + -1;
		var y = (Math.random() * 2) + -1;
		return new Game.Vector(x, y);		
	}
};