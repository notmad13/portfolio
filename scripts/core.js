const canvas = document.createElement("canvas"),
	context = canvas.getContext("2d");
setContext(context);

fullscreenCanvas();
console.log(context)

const mouse = {
	x: 0,
	y: 0,
	down: false,
	clicked: false
}

const starCount = 100;
const stars = [];

let midpoint = vector(canvas.width / 2, canvas.height / 2);

for (var i = 0; i < starCount; i++) {
	let x = random(0, canvas.width);
	let y = random(0, canvas.height);
	let position = vector(x, y);
	stars.push(new Star(position, 1));
}

function addStar(pos, rad) {
	let x = random(0, canvas.width);
	let y = random(0, canvas.height);
	let position = vector(x, y);
	position = pos == undefined ? position : pos;
	rad = rad == undefined ? 0.1 : rad;
	stars.push(new Star(position, rad));
}

// Game loop
const init = function() {
	make(context, "rect", 0, 0, canvas.width, canvas.height)({
		filled: true,
		fillStyle: "rgba(0, 0, 0, 0.7)"
	});

	for (var i = stars.length - 1; i >= 0; i--) {
		if (stars[i]) {
			stars[i].render();
			stars[i].run();
			if (!stars[i].visible) {
				addStar();
				stars.splice(i, 1);
			}
		}
	}
	mouse.clicked = false;
};

// Run engine
(function engine() {
	init();
	window.requestAnimationFrame(engine);
})();