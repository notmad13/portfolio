const drawSettings = {
	context: null
}

const setContext = function(context) {
	drawSettings.context = context;
}

const make = function(context, type) {
	let ctx = context || drawSettings.context;
	let args = [...arguments];
	args.shift();
	args.shift();
	const init = function(settings) {
		settings = settings || {};
		ctx.beginPath();
		let stroked = false;
		let filled = false;
		let clippedShape = null;
		let settingKeys = Object.keys(settings);
		for (var i = 0; i < settingKeys.length; i++) {
			let key = settingKeys[i];
			let value = settings[key];
			ctx[key] = value;
			if (key == "stroked" && value) {
				stroked = true;
			}
			if (key == "filled" && value) {
				filled = true;
			}
			if (key == "createClip") {
				clippedShape = value;
			}
		}
		if (type != "line") {
			ctx[type](...args);
		}
		if (type == "line") {
			ctx.moveTo(args[0], args[1]);
			ctx.lineTo(args[2], args[3]);
		}
		if (filled) {
			ctx.fill();
		}
		if (stroked) {
			ctx.stroke();
		}
		if (clippedShape) {
			ctx.save();
			ctx.clip();
			clippedShape(ctx);
			ctx.restore();
		}
		ctx.closePath();
		return make;
	}
	return init;
}

const vector = function (x, y) {
	return {x: x, y: y};
}

const setMag = function(vector, mag) {
	mag = mag == undefined ? 1 : mag;
	var len = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
	len = len == 0 ? 0.001 : len;
	return {
		x: vector.x * (1 / len) * mag,
		y: vector.y * (1 / len) * mag
	};
}

const sortArrayByObjectKey = function(array, objectKey) {
	let arrayCopy = array.slice();
	let newArray = [];
	let dummyObject = {};
	let highIndex = 0;
	dummyObject[objectKey] = 0;
	for (var i = arrayCopy.length - 1; i >= 0; i--) {
		if (arrayCopy[i][objectKey] > dummyObject[objectKey]) {
			dummyObject = arrayCopy[i];
			highIndex = i;
		}
		if (i == 0) {
			newArray.push(dummyObject);
			dummyObject = {};
			dummyObject[objectKey] = 0;
			arrayCopy.splice(highIndex, 1);
			highIndex = undefined;
			i = arrayCopy.length;
		}
	}
	return newArray.reverse();
}

const getTime = function() {
	return new Date().getTime();
}

const lerp = function(start, stop, per) {
	return per * (stop - start) + start;
}

const random = function() {
	if (arguments.length == 2 && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
		return (Math.random() * (arguments[1] - arguments[0]) + arguments[0]);
	} else if (arguments.length == 1 && typeof arguments[0] == "number") {
		return (Math.random() * (arguments[0] - 0) + 0);
	} else if (Array.isArray(arguments[0])) {
		return arguments[0][Math.floor(Math.random() * arguments[0].length)];
	} else if (arguments.length > 2) {
		let args = [...arguments];
		return args[Math.floor(Math.random() * args.length)];
	}
}

const distX = function(x1, x2) {
	return Math.sqrt(Math.pow(x2 - x1, 2));
}

const distY = function(y1, y2) {
	return Math.sqrt(Math.pow(y2 - y1, 2));
}

const dist = function(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(distX(x1, x2), 2) + Math.pow(distY(y1, y2), 2));
}

const constrain = function(n, min, max) {
	return Math.max(Math.min(n, max), min);
}

const map = function(n, start1, stop1, start2, stop2) {
	var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (start2 < stop2) {
		return constrain(newval, start2, stop2);
	} else {
		return constrain(newval, stop2, start2);
	}
}

const createVector = function(cx, cy, cz) {
	if (Array.isArray(arguments[0]) || Array.isArray(arguments[1]) || Array.isArray(arguments[2]) || typeof arguments[0] === "string" || typeof arguments[1] === "string" || typeof arguments[2] === "string") {
		throw new Error("Vector must be numeric")
	}
	if ((typeof arguments[0] == "object" && !Array.isArray(arguments[0]))) {
		let firstArg = arguments[0];
		cx = firstArg.x;
		cy = firstArg.y;
		cz = firstArg.z;
	}
	cx = cx == undefined ? 0 : cx;
	cy = cy == undefined ? 0 : cy;
	cz = cz == undefined ? 0 : cz;
	(this.Vector = function(x, y, z) {
		x = x == undefined ? cx : x;
		y = y == undefined ? cy : y;
		z = z == undefined ? cz : z;
		this.x = x;
		this.y = y;
		this.z = z;
	}).prototype = {
		setMag: function(mag) {
			mag = mag == undefined ? 1 : mag;
			var len = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
			len = len == 0 ? 0.1 : len;
			return new Vector(this.x * (1 / len) * mag, this.y * (1 / len) * mag, this.z * (1 / len) * mag);
		},
		mag: function() {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		},
		add: function() {
			if (arguments.length == 1) {
				if (arguments[0].x != undefined || arguments[0].y != undefined || arguments[0].z != undefined && (typeof arguments[0] == "object" && !Array.isArray(arguments[0]))) {
					return new Vector(this.x + arguments[0].x, this.y + arguments[0].y, this.z + arguments[0].z);
				}
				if (Number.isInteger(arguments[0]) || (Number(arguments[0]) === arguments[0] && arguments[0] % 1 !== 0) || (Number(arguments[0]) === arguments[0] && arguments[0] % 1 !== 0)) {
					return new Vector(
						this.x + arguments[0],
						this.y + arguments[0],
						this.z + arguments[0]
					);
				}
			}
			if (arguments.length == 2) {
				return new Vector(this.x + arguments[0], this.y + arguments[1]);
			}
			if (arguments.length == 3) {
				return new Vector(this.x + arguments[0], this.y + arguments[1], this.z + arguments[2]);
			}
		},
		sub: function() {
			if (arguments.length == 1) {
				if (arguments[0].x != undefined || arguments[0].y != undefined || arguments[0].z != undefined && (typeof arguments[0] == "object" && !Array.isArray(arguments[0]))) {
					return new Vector(this.x - arguments[0].x, this.y - arguments[0].y, this.z - arguments[0].z);
				}
				if (Number.isInteger(arguments[0]) || (Number(arguments[0]) === arguments[0] && arguments[0] % 1 !== 0)) {
					return new Vector(this.x - arguments[0], this.y - arguments[0], this.z - arguments[0]);
				}
			}
			if (arguments.length == 2) {
				return new Vector(this.x - arguments[0], this.y - arguments[1]);
			}
			if (arguments.length == 3) {
				return new Vector(this.x - arguments[0], this.y - arguments[1], this.z - arguments[2]);
			}
		},
		div: function() {
			if (arguments.length == 1) {
				if (arguments[0].x != undefined || arguments[0].y != undefined || arguments[0].z != undefined && (typeof arguments[0] == "object" && !Array.isArray(arguments[0]))) {
					return new Vector(this.x / arguments[0].x, this.y / arguments[0].y, this.z / arguments[0].z);
				}
				if (Number.isInteger(arguments[0]) || (Number(arguments[0]) === arguments[0] && arguments[0] % 1 !== 0)) {
					return new Vector(this.x / arguments[0], this.y / arguments[0], this.z / arguments[0]);
				}
			}
			if (arguments.length == 2) {
				return new Vector(this.x / arguments[0], this.y / arguments[1]);
			}
			if (arguments.length == 3) {
				return new Vector(this.x / arguments[0], this.y / arguments[1], this.z / arguments[2]);
			}
		},
		mult: function() {
			if (arguments.length == 1) {
				if (arguments[0].x != undefined || arguments[0].y != undefined || arguments[0].z != undefined && (typeof arguments[0] == "object" && !Array.isArray(arguments[0]))) {
					return new Vector(this.x * arguments[0].x, this.y * arguments[0].y, this.z * arguments[0].z);
				}
				if (Number.isInteger(arguments[0]) || (Number(arguments[0]) === arguments[0] && arguments[0] % 1 !== 0)) {
					return new Vector(this.x * arguments[0], this.y * arguments[0], this.z * arguments[0]);
				}
			}
			if (arguments.length == 2) {
				return new Vector(this.x * arguments[0], this.y * arguments[1]);
			}
			if (arguments.length == 3) {
				return new Vector(this.x * arguments[0], this.y * arguments[1], this.z * arguments[2]);
			}
		},
		normalize: function() {
			return this.div(this.mag());
		}
	};
	return new this.Vector();
}

const camera2d = function(context, settings) {
	(this.Camera2D = function() {
		settings = settings || {};
		this.distance = 1000.0;
		this.movement = vector(0, 0);
		this.context = context;
		this.fieldOfView = settings.fieldOfView || Math.PI / 4.0;
		this.viewport = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0,
			scale: [1.0, 1.0]
		};
		this.moveTransitionSpeed = settings.moveTransitionSpeed || 1;
		this.zoomTransitionSpeed = settings.zoomTransitionSpeed || 1;
		this.sizeTransitionSpeed = settings.sizeTransitionSpeed || 1;
		this.updateViewport();
	}).prototype = {
		setMoveTransitionSpeed: function(speed) {
			this.moveTransitionSpeed = speed;
		},
		setZoomTransitionSpeed: function(speed) {
			this.zoomTransitionSpeed = speed;
		},
		setSizeTransitionSpeed: function(speed) {
			this.sizeTransitionSpeed = speed;
		},
		begin: function() {
			this.context.save();
			this.applyScale();
			this.applyTranslation();
		},
		end: function() {
			this.context.restore();
		},
		applyScale: function() {
			this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
		},
		applyTranslation: function() {
			this.context.translate(-this.viewport.left, -this.viewport.top);
		},
		updateViewport: function() {
			this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
			this.viewport.width = lerp(this.viewport.width, this.distance * Math.tan(this.fieldOfView), this.sizeTransitionSpeed);
			this.viewport.height = lerp(this.viewport.height, this.viewport.width / this.aspectRatio, this.sizeTransitionSpeed);
			this.viewport.left = this.movement.x - (this.viewport.width / 2);
			this.viewport.top = this.movement.y - (this.viewport.height / 2);
			this.viewport.right = this.viewport.left + this.viewport.width;
			this.viewport.bottom = this.viewport.top + this.viewport.height;
			this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
			this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
		},
		zoomTo: function(z) {
			this.distance = lerp(this.distance, z, this.zoomTransitionSpeed);
			this.updateViewport();
		},
		moveTo: function(x, y) {
			this.movement.x = lerp(this.movement.x, x, this.moveTransitionSpeed);
			this.movement.y = lerp(this.movement.y, y, this.moveTransitionSpeed);
			this.updateViewport();
		},
		screenToWorld: function(x, y, obj) {
			obj = obj || {
				x: (x / this.viewport.scale[0]) + this.viewport.left,
				y: (y / this.viewport.scale[1]) + this.viewport.top
			};
			return obj;
		},
		worldToScreen: function(x, y, obj) {
			obj = obj || {
				x: (x - this.viewport.left) * (this.viewport.scale[0]),
				y: (y - this.viewport.top) * (this.viewport.scale[1])
			};
			return obj;
		}
	};
	return new this.Camera2D();
}

const getFixedTarget = function(main, target, offset) {
	let diff = setMag(vector(target.x - main.x, target.y - main.y), offset);
	let x = main.x + diff.x;
	let y = main.y + diff.y;
	return vector(x, y);
}

const fullscreenCanvas = function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}