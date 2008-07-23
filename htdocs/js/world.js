// TODO: Use Actor IDs as the key in the actors array

(function() {
	var G = Game;
	var C = YAHOO.util.CustomEvent;
	G.World = function() {
		this.stage = null;
		this.hero = null;
		this.lives = 3;
		this.points = 0;
		this.actor_id_seed = 1;
		this.actors = [];
		this.spawns = [];
		this.spawning = false;
		this.width = 640;
		this.height = 480;
		this.initStage();
		this.locationGrid = null;
		this.locationGridSize = 32;
		this.onScore = new C('score', this);
	};
	var proto = G.World.prototype;
	proto.initStage = function() {
		this.stage = document.getElementById('stage');
		if (!this.stage) {
			this.stage = document.createElement('div');
			this.stage.id = 'stage';
			document.body.appendChild(this.stage);
		}
		var s = this.stage.style;
		s.position = 'relative';
		s.width = this.width + 'px';
		s.height = this.height + 'px';
		s.backgroundColor = '#000';
		var bg = Game.util.randomRange(1, 3);
		s.backgroundImage = 'url(images/backgrounds/space' + bg + '.jpg)';
	};
	proto.makeSprite = function() {
		var sprite = document.createElement('div');
		var s = sprite.style;
		s.position = 'absolute';
		s.backgroundImage = 'url(images/sprites/shapes.png)';
		s.width = '32px';
		s.height = '32px';
		s.zIndex = 10;
		s.display = 'none';
		this.stage.appendChild(sprite);
		return sprite;
	};
	proto.makeActor = function(def) {
		var s = this.makeSprite();
		var a = new Game.Actor(def, s);
		a.id = 'actor' + this.actor_id_seed++;
		//this.actors.push(a);
		this.actors[a.id] = a;
		if (def === Game.ActorDefs.Hero) { this.hero = a; }
		return a;
	};
	proto.spawnActor = function(parent, def, count) {
		for (var x = 0; x < count; x++) {
			var actor = this.makeActor(def);
			actor.position = parent.position.copy();
			actor.direction = Game.util.randomDirection();
			actor.show();
		}
	};
	proto.killActor = function(actor_index) {
		var actor = this.actors[actor_index];
		if (actor !== null && actor !== undefined) {
			actor.fire('die', this);
			actor.alive = false;
			this.stage.removeChild(actor.sprite);
			delete(this.actors[actor_index]);
		}
	};
	proto.getActorIndex = function(actor) {
		var len = this.actors.length;
		for (var x = 0; x < len; x++) {
			if (this.actors[x] === actor) {
				return x;
			}
		}
		return false;
	};
	proto.centerActor = function(actor) {
		actor.position.x = (this.width / 2) - 16;
		actor.position.y = (this.height / 2) - 16;
	};
	proto.initSpawns = function() {
		// TODO: Don't hardocode spawn points
		this.spawns[0] = new Game.Vector(0, 0);
		this.spawns[1] = new Game.Vector(this.width - 32, 0);
		this.spawns[2] = new Game.Vector(0, this.height - 32);
		this.spawns[3] = new Game.Vector(this.width - 32, this.height - 32);
		this.spawning = true;
		this.spawn();
	};
	proto.spawn = function() {
		if (!this.spawning) { return false; }
		var len = this.spawns.length;
		for (var x = 0; x < len; x++) {
			var def = null;
			switch (Game.util.randomRange(1, 5)) {
				case 1: def = Game.ActorDefs.EnemyPinky; break;
				case 2: def = Game.ActorDefs.EnemyTracker; break;
				case 3: def = Game.ActorDefs.EnemyFlower; break;
				case 4: def = Game.ActorDefs.EnemyCoward; break;
				case 5: def = Game.ActorDefs.EnemyGhost; break;
			}
			var spawn = this.makeActor(def);
			spawn.position = this.spawns[x].copy();
			spawn.direction.x = 1;
			spawn.direction.y = 1;
			spawn.show();
		}
	};
	proto.killAll = function() {
		var len = this.actors.length;
		for (var x = 0; x < len; x++) {
			var a = this.actors[x];
			if (a !== null && a.def.role === 'enemy') { this.killActor(x); }
		}
	};
	proto.awardPoints = function(points) {
		this.points += points;
		this.onScore.fire(points);
	};
	proto.update = function(elapsed) {
		this.initLocationGrid();
		// Move each actor and place them in the collision grid
		for (var a in this.actors) {
			var actor = this.actors[a];
			if (actor === null) { continue; }
			var movement = actor.getMove(elapsed);
			var position = actor.position.add(movement);
			// TODO: Clean up wall hit detection
			var hitv = null;
			if (position.x < 0) { hitv = new Game.Vector(-1, 0); movement.x = 0; }
			if ((position.x + 32) > this.width) { hitv = new Game.Vector(1, 0); movement.x = 0; }
			if (position.y < 0) { hitv = new Game.Vector(0, -1); movement.y = 0; }
			if ((position.y + 32) > this.height) { hitv = new Game.Vector(0, 1); movement.y = 0; }
			actor.move(movement);
			if (hitv !== null) { actor.hitWall(hitv, this); }
			this.addToLocationGrid(actor);
		}
		this.checkCollision();
	};
	proto.initLocationGrid = function() {
		this.locationGrid = [];
	};
	proto.addToLocationGrid = function(actor) {
		if (actor === null) { return false; }
		if (actor.def.role !== null) {
			var grid = this.locationGrid;
			var key = actor.position.divScalar(this.locationGridSize);
			if (typeof(grid[key]) === 'undefined') { grid[key] = []; }
			grid[key].push(actor);
		}
	};
	proto.checkCollision = function() {
		var hash = this.locationGrid;
		// Check the grid for actor collisions
		for (var k in hash) {
			var actors = hash[k];
			var len = actors.length;
			if (len < 2) { continue; }
			for (var a1 = 0; a1 < len; a1++) {
				var actor1 = actors[a1];
				if (actor1 === null) { continue; }
				if (actor1 === this.hero) { continue; }
				var bounds1 = actor1.getBounds();
				// Look through each of the 4 cells that this actor could be in and check collisions
				for (var cx = 0; cx < 2; cx++) {
					for (var cy = 0; cy < 2; cy++) {
						var ck = new Game.Vector(k.x + cx, k.y + cy);
						if (typeof(hash[ck]) === 'undefined') { continue; }
						var cell_actors = hash[ck];
						var cell_len = cell_actors.length;
						if (cell_len < 1) { continue; }
						var start = (cx === 0 && cy === 0) ? a1 + 1: 0;
						for (var a2 = start; a2 < cell_len; a2++) {
							var actor2 = actors[a2];
							if (actor2 === null) { continue; }
							if (actor2 === this.hero) { continue; }
							if (actor1.def.role !== actor2.def.role) {
								var bounds2 = actor2.getBounds();
								if (bounds1.intersect(bounds2)) {
									if (actor1.alive && actor2.alive) {
										this.awardPoints(actor1.getPoints() + actor2.getPoints());
									}
									this.killActor(actor1.id);
									this.killActor(actor2.id);
									break;
								}
							}	
						}
					}
				}				
			}
		}
	};
})();