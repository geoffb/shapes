(function() {
	Game.Engine = function() {
		this.world = new Game.World();
		this.world.initSpawns();
		this.hud = new Game.HUD(this.world.stage);
		this.last_update = 0;
		this.lives = 3;
		this.score = 0;
		this.updateHUD();
	};
	var proto = Game.Engine.prototype;
	proto.getElapsed = function() {
		var d = new Date();
		var t = d.getTime();
		if (this.last_update === 0) { this.last_update = t; }
		var elapsed = t - this.last_update;
		this.last_update = t;
		return elapsed;
	};
	proto.updateHUD = function() {
		this.hud.updateLives(this.lives);
		this.hud.updateScore(this.score);
	};
	proto.addScore = function(points) {
		this.score += points;
		this.updateHUD();
	};
	proto.animate = function() {
		var len = this.world.actors.length;
		for (var x = 0; x < len; x++) {
			var a = this.world.actors[x];
			if (a !== null && a.def.steps > 0) {
				a.spritev.x += 32;
				if (a.spritev.x > ((a.def.steps * 32)) + a.def.spritex) { a.spritev.x = a.def.spritex; }
				a.updateSprite();
			}
		}
	};
	proto.think = function() {
		var len = this.world.actors.length;
		for (var x = 0; x < len; x++) {
			var a = this.world.actors[x];
			if (a !== null) { a.think(this.world); }
		}
	};
	proto.update = function() {
		var elapsed = this.getElapsed();
		this.world.update(elapsed);
	};
})();

function keyDown(e) {
	e.stopPropagation();
	var v = new Game.Vector(0, 0);
	switch (e.keyCode) {
		case 37: v.x += -1; break;
		case 38: v.y += -1; break;
		case 39: v.x += 1; break;
		case 40: v.y += 1; break;
		case 32:
			var b = engine.world.makeActor(Game.ActorDefs.Projectile);
			b.position = hero.position.copy();
			b.direction = hero.facing.copy();
			b.speed = 40;
			b.show();
			break;
	}
	hero.changeDirection(v);
}

function keyUp(e) {
	e.stopPropagation();
	var v = new Game.Vector(0, 0);
	switch (e.keyCode) {
		case 37: v.x -= -1; break;
		case 38: v.y -= -1; break;
		case 39: v.x -= 1; break;
		case 40: v.y -= 1; break;
	}
	hero.changeDirection(v);
}

var stage = document.getElementById('stage');
var engine = new Game.Engine(stage);

var hero = engine.world.makeActor(Game.ActorDefs.Hero);
engine.world.centerActor(hero);
hero.show();

Game.util.addEventListener(window, 'keydown', keyDown);
Game.util.addEventListener(window, 'keyup', keyUp);

function spawner() { engine.world.spawn(); }
function updater() { engine.update(); }
function animator() { engine.animate(); }
function thinker() { engine.think(); }

window.setInterval(spawner, 5000);
window.setInterval(thinker, 250);
window.setInterval(animator, 100);
window.setInterval(updater, 25);