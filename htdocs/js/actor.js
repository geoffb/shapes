(function() {
	var G = Game;
	G.Actor = function(def, sprite) {
		this.id = 0;
		this.owner_id = null;
		this.children = 0;
		this.cooldown = 0;
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
		// TODO: Is there any way to improve the performance of this function?
		var s = this.sprite.style;
		var pos_x = parseInt(this.position.x) + 'px';
		var pos_y = parseInt(this.position.y) + 'px';
		var pos_bg = -parseInt(this.spritev.x) + 'px ' + -parseInt(this.spritev.y) + 'px';
		if (s.backgroundPosition !== pos_bg) { s.backgroundPosition = pos_bg; }
		if (s.left !== pos_x) { s.left = pos_x; }
		if (s.top !== pos_y) {s.top = pos_y; }
	};
	proto.getBounds = function(rect) {
		// TODO: Magic numbers are bad
		rect.x = this.position.x + 5;
		rect.y = this.position.y + 5;
		rect.w = 22;
		rect.h = 22;
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