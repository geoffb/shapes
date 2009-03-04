(function() {
	var G = Game;
	Game.Engine = function() {
		this.initWorld();
		this.hud = new Game.HUD(this.world.stage);
		this.last_update = 0;
		this.lives = 3;
		this.bombs = 3;
		this.score = 0;
		this.updateHUD();
		this.initInput();
		this.hud.displayText('press space to begin', null, 100, 640, null);
		this.accept_input = false;
		this.state = 'ready';
	};
	var proto = Game.Engine.prototype;
	proto.startGame = function() {
		this.hud.clearText();
		this.state = 'playing';
		this.accept_input = true;
		this.world.spawning = true;
	};
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
		this.world.onActorCollide.subscribe(this.onActorCollide, this);
		this.crosshair = this.world.makeSprite();
		//this.crosshair.id = 'crosshair';
		this.crosshair.style.backgroundPosition = '-224px 0px';
		this.crosshair.style.left = 0;
		this.crosshair.style.top = 0;
		this.crosshair.style.zIndex = 50;
		this.crosshair.style.display = 'block';
	};
	proto.awardPoints = function(points) {
		this.score += points;
		this.updateHUD();
	};
	proto.onActorCollide = function(type, args, me) {
		var actor1 = args[0];
		var actor2 = args[1];
		if (actor1.def.role !== actor2.def.role) {
			if (!actor1.alive || !actor2.alive) { return; }
			var hid = me.world.hero.id;
			if (actor1.id === hid || actor2.id === hid) {
				me.accept_input = false;
				me.world.spawning = false;
				me.world.killActor(hid);
				me.lives--;
				me.updateHUD();
				if (me.lives >= 1) {
					var reset = function() {
						me.world.killAll();
						me.world.initHero();
						me.world.spawning = true;
						me.accept_input = true;
					};
					window.setTimeout(reset, 5000);
				} else {
					me.hud.displayText('game over', null, 30, 640, null, '#f00');
					me.hud.displayText('reload the page to play again', null, 150, 640, null);
				}
				return;
			}
			me.awardPoints(actor1.getPoints() + actor2.getPoints());
			me.world.killActor(actor1.id);
			me.world.killActor(actor2.id);
		}
	};
	proto.initInput = function() {
		this.input = new Game.InputHandler(window, this.world.stage);
		this.input.onKeyDown.subscribe(this.onKeyDown, this);
		this.input.onKeyUp.subscribe(this.onKeyUp, this);
		//this.input.onMouseDown.subscribe(this.onMouseDown, this);
	};
	proto.onKeyDown = function(type, args, me) {
		if (me.state === 'ready' && args[0] === 32) {
			me.startGame();
			return;
		}
		if (!me.accept_input) { return; }
		var v = new Game.Vector(0, 0);
		switch (args[0]) {
			case 65: v.x += -1; break;
			case 87: v.y += -1; break;
			case 68: v.x += 1; break;
			case 83: v.y += 1; break;
			case 32:
				if (me.bombs > 0) {
					me.bombs -= 1;
					me.world.killAll();
					me.updateHUD();
				}
				break;
		}
		me.world.hero.changeDirection(v);
	};
	proto.onKeyUp = function(type, args, me) {
		if (!me.accept_input) { return; }
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
		//me.world.hero.attack(me.world);
	};
	proto.updateHUD = function() {
		this.hud.updateLives(this.lives);
		this.hud.updateScore(this.score);
		this.hud.updateBombs(this.bombs);
	};
	proto.animate = function() {
		for (var actor_id in this.world.actors) {
			this.world.actors[actor_id].animate();
		}
	};
	proto.think = function() {
		for (var actor_id in this.world .actors) {
			var a = this.world.actors[actor_id];
			if (a !== null) { a.think(this.world); }
		}
	};
	proto.update = function() {
		var elapsed = this.getElapsed();
		this.world.update(elapsed);
		if (this.crosshair) {
			this.crosshair.style.left = (this.input.mouseX - 16) + 'px';
			this.crosshair.style.top = (this.input.mouseY - 16) + 'px';
		}
		// TODO: Move the shooting code somewhere else!
		if (this.accept_input && this.input.mouse_down) {
			if (this.world.hero.cooldown === 0 && this.world.hero.children <= 20) {
				this.world.hero.cooldown = 150;
				var v = new Game.Vector(this.input.mouseX, this.input.mouseY);
				v = v.sub(this.world.hero.position.add(new G.Vector(16, 16)));
				v.normalize();
				var p = this.world.makeActor(Game.ActorDefs.Projectile);
				p.position = this.world.hero.position.copy();
				p.direction = v;
				p.owner_id = this.world.hero.id;
				this.world.hero.children++;
				p.show();
			}
		}
	};
})();

var engine = new Game.Engine();
window.setInterval((function(){engine.world.spawn();}),2500);
window.setInterval((function(){engine.think();}),250);
window.setInterval((function(){engine.animate();}),100);
window.setInterval((function(){engine.update();}),50)