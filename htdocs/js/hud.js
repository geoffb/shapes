(function() {
	var G = Game;
	var D = YAHOO.util.Dom;
	G.HUD = function(stage) {
		this.stage = stage;
		this.hud = null;
		this.init();
		this.lives = D.get('hud_lives');
		this.score = D.get('hud_score');
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
	proto.displayText = function(text, x, y, w, h, color) {
		var d = document.createElement('div');
		d.innerHTML = text;
		d.className = 'text';
		if (x === null) { x = (640 / 2) - (w / 2); }
		var s = d.style;
		s.position = 'absolute';
		s.top = y + 'px';
		s.left = x + 'px';
		s.width = w + 'px';
		if (h !== null) { s.height = h + 'px'; };
		s.color = (typeof(color) === 'undefined') ? '#fff': color;
		s.zIndex = '110';
		//s.background = 'red';
		s.textAlign = 'center';
		s.fontSize = '3em';
		s.fontFamily = 'sans-serif';
		s.background = 'url(images/chrome/gray50.png)';
		s.padding = '0.25em 0';
		this.stage.appendChild(d);
		return d;
	};
	proto.clearText = function() {
		var texts = D.getElementsByClassName('text', 'div', this.stage);
		for (var i in texts) {
			var t = texts[i];
			this.stage.removeChild(t);
		}
	};
})();