(function() {
	var G = Game;
	G.HUD = function(stage) {
		this.stage = stage;
		this.hud = null;
		this.init();
		this.lives = document.getElementById('hud_lives');
		this.score = document.getElementById('hud_score');
	};
	var proto = G.HUD.prototype;
	proto.init = function() {
		this.hud = document.createElement('div');
		this.hud.className = 'hud';
		this.hud.innerHTML += '<span class="field">Lives: <span id="hud_lives"></span></span>';
		this.hud.innerHTML += '<span class="field">Score: <span id="hud_score"></span></span>';
		this.stage.appendChild(this.hud);
	}
	proto.updateLives = function(number) {
		this.lives.innerHTML = number;
	};
	proto.updateScore = function(number) {
		this.score.innerHTML = number;
	};
})();