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
		//this.updateSprite();
	};
	var proto = G.Actor.prototype;
	proto.getPoints = function() {
		return (this.def.score) ? this.def.score: 0;
	};
	proto.animate = function() {
		if (this.def.steps > 0) {
			this.spritev.x += 32;
			if (this.spritev.x > ((this.def.steps * 32)) + this.def.spritex) { this.spritev.x = this.def.spritex; }
		}
	};
	proto.updateSprite = function() {
		var s = this.sprite.style;
		s.backgroundPosition = -this.spritev.x + 'px ' + -this.spritev.y + 'px';
		s.left = this.position.x + 'px';
		s.top = this.position.y + 'px';
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
	proto.show = function() {
		this.updateSprite();
		this.sprite.style.display = '';
	};
	proto.fire = function(event_name, world) {
		if (this.def[event_name]) { this.def[event_name](this, world); }
	};
	proto.think = function(world) {
		this.fire('think', world);
	};
	proto.attack = function(world) {
		this.fire('attack', world);
	};
	proto.die = function(world) {
		this.fire('die', world);
	};
	proto.hitWall = function(hitv, world) {
		if (this.def.hitWall) { this.def.hitWall(this, hitv, world); }
	};
})();