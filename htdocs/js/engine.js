(function() {
	var G = Game;
	Game.Engine = function() {
		this.initWorld();
		this.hud = new Game.HUD(this.world.stage);
		this.last_update = 0;
		this.updateHUD();
		this.initInput();
		this.initHero();
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
	proto.initHero = function() {
		var hero = this.world.makeActor(Game.ActorDefs.Hero);
		this.world.centerActor(hero);
		hero.show();
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
			this.world.actors[actor_id].animate();
		}
	};
	proto.think = function() {
		for (var actor_id in this.world.actors) {
			var a = this.world.actors[actor_id];
			if (a !== null) { a.think(this.world); }
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
window.setInterval((function(){engine.world.spawn();}),1500);
window.setInterval((function(){engine.think();}),250);
window.setInterval((function(){engine.animate();}),100);
window.setInterval((function(){engine.update();}),50)