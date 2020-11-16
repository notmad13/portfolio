class Star {
	constructor(position, radius) {
		this.position = position;
		this.radius = radius;
		this.visible = true;
		this.red = random(30, 255);
		this.blue = random(30, 255);
		this.green = random(30, 255);
		this.color = "rgb(" + this.red + ", " + this.blue + ", " + this.green + ")";
	}

	render() {
		context.beginPath();
		context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
		context.shadowBlur = 15;
		context.shadowColor = this.color;
		context.fillStyle = this.color;
		context.fill();
		context.closePath();
		context.shadowBlur = 0;
		/*make(context, "arc", this.position.x, this.position.y, this.radius, 0, Math.PI * 2)({
			filled: true,
			fillStyle: this.color
		});*/
	}

	run() {
		this.updatePosition();
		if (this.position.x + this.radius < 0 || this.position.x - this.radius > canvas.width || this.position.y + this.radius < 0 || this.position.y - this.radius > canvas.height) {
			this.visible = false;
		}
	}

	updatePosition() {
		this.angleFromMiddle = Math.atan2(this.position.y - midpoint.y, this.position.x - midpoint.x);
		let distanceFromMidpoint = dist(this.position.x, this.position.y, midpoint.x, midpoint.y);
		this.speed = map(distanceFromMidpoint, 0, midpoint.x, 0.2, 10);
		this.velocity = vector(Math.cos(this.angleFromMiddle) * this.speed, Math.sin(this.angleFromMiddle) * this.speed);

		this.radius += this.speed / 130;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}