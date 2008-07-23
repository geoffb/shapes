(function() {
	var G = Game;
	Game.Engine = function() {
		this.initWorld();
		this.hud = new Game.HUD(this.world.stage);
		this.last_update = 0;
		this.updateHUD();
		this.initInput();
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
	proto.initWorld = function() {
		this.world = new G.World();
		this.world.initSpawns();
		this.world.onScore.subscribe(this.onScore, this);
	};
	proto.onScore = function(type, args, me) {
		me.updateHUD();
	};
	proto.initInput = function() {
		this.input = new Game.InputHandler(window, this.world.stage);
		this.input.onKeyDown.subscribe(this.onKeyDown, this);
		this.input.onKeyUp.subscribe(this.onKeyUp, this);
		//this.input.onMouseDown.subscribe(this.onMouseDown, this);
	};
	proto.onKeyDown = function(type, args, me) {
		var v = new Game.Vector(0, 0);
		switch (args[0]) {
			case 65: v.x += -1; break;
			case 87: v.y += -1; break;
			case 68: v.x += 1; break;
			case 83: v.y += 1; break;
		}
		me.world.hero.changeDirection(v);
	};
	proto.onKeyUp = function(type, args, me) {
		var v = new Game.Vector(0, 0);
		switch (args[0]) {
			case 65: v.x -= -1; break;
			case 87: v.y -= -1; break;
			case 68: v.x -= 1; break;
			case 83: v.y -= 1; break;
		}
		me.world.hero.changeDirection(v);
	};
	proto.onMouseDown = function(type, args, me) {
		me.world.hero.attack(me.world);
	};
	proto.updateHUD = function() {
		this.hud.updateLives(this.world.lives);
		this.hud.updateScore(this.world.points);
	};
	proto.animate = function() {
		for (var actor_id in this.world.actors) {
			var actor = this.world.actors[actor_id];
			if (actor.def.steps > 0) {
				actor.spritev.x += 32;
				if (actor.spritev.x > ((actor.def.steps * 32)) + actor.def.spritex) { actor.spritev.x = actor.def.spritex; }
			}
		}
	};
	proto.think = function() {
		for (var actor_id in this.world.actors) {
			var a = this.world.actors[actor_id];
			if (a !== null) { a.fire('think', this.world); }
		}
	};
	proto.update = function() {
		var elapsed = this.getElapsed();
		this.world.update(elapsed);
		if (this.input.mouse_down) {
			var v = new Game.Vector(this.input.mouseX, this.input.mouseY);
			v = v.sub(this.world.hero.position);
			v.normalize();			

			var p = this.world.makeActor(Game.ActorDefs.Projectile);
			p.position = this.world.hero.position.copy();
			p.direction = v;
			p.show();
			

		}
	};
	proto.debug = function() {
		var total_actors = 0;
		var null_actors = 0;
		for (var a in this.world.actors) {
			var actor = this.world.actors[a];
			total_actors++;
			if (actor === null) { null_actors++; }
		}
		console.log('=========>');
		console.log('Actors: ' + total_actors + ' [' + null_actors + ' null] ' + (total_actors - null_actors) + ' Active!');
	};
})();


var engine = new Game.Engine();

var hero = engine.world.makeActor(Game.ActorDefs.Hero);
engine.world.centerActor(hero);
hero.show();



function spawner() { engine.world.spawn(); }
function updater() { engine.update(); }
function animator() { engine.animate(); }
function thinker() { engine.think(); }
function debug() { engine.debug(); }

window.setInterval(spawner, 5000);
window.setInterval(thinker, 250);
window.setInterval(animator, 100);
//window.setInterval(updater, 50);
//window.setInterval(debug, 3000);


window.setInterval((function(){engine.update();}), 50)
