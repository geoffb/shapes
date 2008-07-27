Game.ActorDefs = {};

Game.ActorDefs.Debris = {
	role:null,
	score:0,
	spritex:0,
	spritey:192,
	steps:5,
	init:function(me) {
		me.speed = Game.util.randomRange(2, 12);
	},
	hitWall:function(me, hitv, world) {
		world.killActor(me.id);
	}
};

Game.ActorDefs.Hero = {
	role:'hero',
	score:0,
	spritex:0,
	spritey:160,
	steps:5,
	init:function(me) {
		me.speed = 20;
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 20);
	}
};

Game.ActorDefs.Projectile = {
	role:'hero',
	score:0,
	spritex:192,
	spritey:0,
	steps:0,
	init:function(me) {
		me.speed = 40;
	},
	hitWall:function(me, hitv, world) {
		world.killActor(me.id);
	}
};

Game.ActorDefs.EnemyPinky = {
	role:'enemy',
	score:100,
	spritex:0,
	spritey:0,
	steps:5,
	init:function(me) {
		me.speed = 4;
	},
	hitWall:function(me, hitv, world) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.EnemyElDiablo, 3);
	},
	think:function(me, world) {
		var p = world.hero.position;
		if (world.hero !== null && me.position.within(125, p)) {
			me.speed = 8;
			me.direction = me.position.chase(p);
		} else {
			me.speed = 4;
			if (Game.util.chance(5)) { me.direction.x *= -1; }
			if (Game.util.chance(5)) { me.direction.y *= -1; }
		}
	}
};

Game.ActorDefs.EnemyElDiablo = {
	role:'enemy',
	score:100,
	spritex:0,
	spritey:128,
	steps:5, 
	init:function(me) {
		me.speed = 12;
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 2);
	},
	hitWall:function(me, hitv) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	think:function(me, world) {
		var p = world.hero.position;
		if (world.hero !== null && me.position.within(75, p)) {
			me.speed = 14;
			me.direction = me.position.chase(p);
		} else {
			me.speed = 12;
			if (Game.util.chance(5)) { me.direction.x *= -1; }
			if (Game.util.chance(5)) { me.direction.y *= -1; }
		}
	}
};

Game.ActorDefs.EnemyTracker = {
	role:'enemy',
	score:25,
	spritex:0,
	spritey:96,
	steps:5,
	init:function(me) {
		me.speed = Game.util.randomRange(3, 6);
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 4);
	},
	hitWall:function(me, hitv) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	think:function(me, world) {
		if (world.hero !== null) {
			var p = world.hero.position;
			me.direction = me.position.chase(p);
		}
	}
};

Game.ActorDefs.EnemyFlower = {
	role:'enemy',
	score:75,
	spritex:192,
	spritey:32,
	steps:1,
	init:function(me) {
		me.speed = 10;
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 4);
	},
	hitWall:function(me, hitv) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	think:function(me, world) {
		if (Game.util.chance(20)) { me.direction.x *= -1; }
		if (Game.util.chance(20)) { me.direction.y *= -1; }
	}
};

Game.ActorDefs.EnemyGhost = {
	role:'enemy',
	score:50,
	spritex:0,
	spritey:64,
	steps:5,
	init:function(me) {
		me.speed = 10;
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 4);
	},
	hitWall:function(me, hitv) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	think:function(me, world) {
		// TODO: Chase player of player is facing away
		if (Game.util.chance(5)) { me.direction.x *= -1; }
		if (Game.util.chance(5)) { me.direction.y *= -1; }
	}
};

Game.ActorDefs.EnemyCoward = {
	role:'enemy',
	score:75,
	spritex:0,
	spritey:32,
	steps:5,
	init:function(me) {
		me.speed = 12;
	},
	die:function(me, world) {
		world.spawnActor(me, Game.ActorDefs.Debris, 4);
	},
	hitWall:function(me, hitv) {
		if (hitv.x !== 0) {
			me.direction.x *= -1;
		}
		if (hitv.y !== 0) {
			me.direction.y *= -1;
		}
	},
	think:function(me, world) {
		var p = world.hero.position;
		if (world.hero !== null && me.position.within(50, p)) {
			me.speed = 15;
			me.direction = me.position.chase(p);
		} else if (me.position.within(100, p)) {
			// run away!
			me.speed = 18;
			if (p.x < me.position.x) { me.direction.x = 1; }
			if (p.x > me.position.x) { me.direction.x = -1; }
			if (p.x === me.position.x) { me.direction.x = 0; }
			if (p.y < me.position.y) { me.direction.y = 1; }
			if (p.y > me.position.y) { me.direction.y = -1; }
			if (p.y === me.position.y) { me.direction.y = 0; }
		} else {
			me.speed = 12;
			if (Game.util.chance(5)) { me.direction.x *= -1; }
			if (Game.util.chance(5)) { me.direction.y *= -1; }
		}
	}
};