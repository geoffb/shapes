(function() {
	var G = Game;
	G.Actor = function(def, sprite) {
		this.id = 0;
		this.def = def;
		this.sprite = sprite;
		this.position = new G.Vector(0, 0);
		this.direction = new G.Vector(0, 0);
		this.facing = new G.Vector(0, 1);
		this.speed = 20;
		this.alive = true;
		this.spritev = new G.Vector(0, 0);
		if (this.def) {
			this.spritev.x = this.def.spritex;
			this.spritev.y = this.def.spritey;
			this.fire('init', null);
		}
		this.updateSprite();
	};
	var proto = G.Actor.prototype;
	proto.getPoints = function() {
		return (this.def.score) ? this.def.score: 0;
	};
	proto.updateSprite = function() {
		this.sprite.style.backgroundPosition = -this.spritev.x + 'px ' + -this.spritev.y + 'px';
		this.sprite.style.left = this.position.x + 'px';
		this.sprite.style.top = this.position.y + 'px';
	};
	proto.getBounds = function() {
		// TODO: Magic numbers are bad
		return new G.Rect(this.position.x + 5, this.position.y + 5, 22, 22);
	};
	proto.getMove = function(elapsed) {
		var distance = this.speed * (elapsed / 100);
		return this.direction.multScalar(distance);
	};
	proto.move = function(vector) {
		this.position.x += vector.x;
		this.position.y += vector.y;
		this.updateSprite();
	};
	proto.changeDirection = function(v) {
		var d = v.add(this.direction);
		if (d.x >= -1 && d.x <= 1 && d.y >= -1 && d.y <= 1) {
			this.direction = d;
			if (this.direction.x !== 0 || this.direction.y !== 0) {
				this.facing = this.direction.copy();
			}
		}
	};
	
	proto.fire = function(event_name, world) {
		if (this.def[event_name]) { this.def[event_name](this, world); }
	};
	
	proto.think = function(world) {
		this.def.think(this, world);
	};
	proto.show = function() {
		this.updateSprite();
		this.sprite.style.display = '';
	};
	proto.hitWall = function(hitv, world) {
		this.def.hitWall(this, hitv, world);
	};
	proto.attack = function(world) {
		this.def.attack(this, world);
	};
})();