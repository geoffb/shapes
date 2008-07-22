(function() {
	var G = Game;
	var E = YAHOO.util.Event;
	var C = YAHOO.util.CustomEvent;
	G.InputHandler = function(elKeyboard, elMouse) {
		this.elMouse = elMouse;
		this.elKeyboard = elKeyboard;
		this.mouse_down = false;
		this.mouseX = 0;
		this.mouseY = 0;
		this.onKeyDown = new C('OnKeyDown', this);
		this.onKeyUp = new C('OnKeyUp', this);
		this.onMouseDown = new C('OnMouseDown', this);
		this.init();
	};
	var proto = G.InputHandler.prototype;
	proto.init = function() {
		E.on(this.elMouse, 'mousedown', this.mouseDown, null, this);
		E.on(this.elMouse, 'mouseup', this.mouseUp, null, this);
		E.on(this.elMouse, 'mousemove', this.mouseMove, null, this);
		E.on(this.elKeyboard, 'keydown', this.keyDown, null, this);
		E.on(this.elKeyboard, 'keyup', this.keyUp, null, this);
	};
	proto.setMouseXY = function(x, y) {
		x -= this.elMouse.offsetLeft;
		y -= this.elMouse.offsetTop;
		this.mouseX = x;
		this.mouseY = y;
	};
	proto.mouseDown = function(e) {
		this.mouse_down = true;
		this.onMouseDown.fire();
		E.preventDefault(e);
	};
	proto.mouseUp = function(e) {
		this.mouse_down = false;
	};
	proto.mouseMove = function(e) {
		this.setMouseXY(e.clientX, e.clientY);
	};
	proto.keyDown = function(e) {
		this.onKeyDown.fire(e.keyCode);
	};
	proto.keyUp = function(e) {
		this.onKeyUp.fire(e.keyCode);
	};
})();