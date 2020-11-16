window.addEventListener("load", function(event) {
	document.body.append(canvas);
});

window.addEventListener("resize", function(event) {
	fullscreenCanvas();
	midpoint = vector(canvas.width / 2, canvas.height / 2);
});

window.addEventListener("mousemove", function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener("mousedown", function(event) {
	mouse.down = true;
});

window.addEventListener("mouseup", function(event) {
	mouse.down = false;
});

window.addEventListener("click", function(event) {
	mouse.clicked = true;
});