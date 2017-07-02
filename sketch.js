let a, b, c, center, radius, ccw;

function setup() {
	createCanvas(windowWidth, windowHeight);
	let button = createButton ("newTriangle");
	button.mousePressed(randomPoints);
	ccw = true;
	let orientation = createButton("change to CW");
	orientation.mousePressed(
		function () {
			if (ccw) orientation.html("change to CCW");
			else orientation.html("change to CW");
			ccw = !ccw;
			[b, c] = [c, b];
		}
	);
	button.position (0, 0);
	orientation.position (0, button.y + button.height);
	randomPoints();
}

function draw() {
	background(51);
	stroke(0);
	noFill();
	ellipse(...center, 2*radius);
	let v = volume(...a, ...b, ...c, mouseX, mouseY)
	if (v < 0) fill(255,0,0);
	else if (v > 0) fill(0,255,0);
	else fill(0,0,255);
	triangle(...a, ...b, ...c);

	dispPoint(a, "A");
	dispPoint(b, "B");
	dispPoint(c, "C");
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	randomPoints();
}

function area (ax, ay, bx, by, cx, cy) {
	return (bx - ax)*(cy - ay)-(cx - ax)*(by - ay);
}

function volume (ax, ay, bx, by, cx, cy, dx, dy) {
	let ax_ = ax-dx;
	let ay_ = ay-dy;
	let bx_ = bx-dx;
	let by_ = by-dy;
	let cx_ = cx-dx;
	let cy_ = cy-dy;

	/*
		ax_, ay_, ax_² + ay_²
		bx_, by_, bx_² + by_²
		cx_, cy_, cx_² + cy_²
	*/
	return (
		(ax_*ax_ + ay_*ay_) * (bx_*cy_-cx_*by_) -
		(bx_*bx_ + by_*by_) * (ax_*cy_-cx_*ay_) +
		(cx_*cx_ + cy_*cy_) * (ax_*by_-bx_*ay_)
	);
}

function randomPoints () {
	a = [floor(random(0, width)), floor(random(0, height))];
	b = [floor(random(0, width)), floor(random(0, height))];
	c = [floor(random(0, width)), floor(random(0, height))];
	let sign = area(...a, ...b, ...c);
	if ((sign > 0 && ccw) || (sign < 0 && !ccw)) [b, c] = [c, b];
	[radius, ...center] = circumscribed(...a, ...b, ...c);
}

function dispPoint([x, y], name) {
	let [mx, my] = center;
	let h = textSize();
	let w = textWidth(name);
	fill(0);
	ellipse(x, y, 10);
	if (x - mx > 0) x += w;
	else x -= w;

	if (y - my > 0) y += h;
	else y -= h;
	textAlign(CENTER, CENTER);
	fill(255);
	text(name, x, y);
}

function circumscribed (ax, ay, bx, by, cx, cy) {

	// compute the center coordinates
	let D = 2 * (ax*(by-cy) + bx*(cy-ay) + cx*(ay-by));
	let ad = ax*ax + ay*ay;
	let bd = bx*bx + by*by;
	let cd = cx*cx + cy*cy;
	let x = (ad*(by-cy) + bd*(cy-ay) + cd*(ay-by))/D;
	let y =-(ad*(bx-cx) + bd*(cx-ax) + cd*(ax-bx))/D;

	// compute the radius
	let dx = x - ax;
	let dy = y - ay;
	let r = Math.sqrt(dx*dx + dy*dy);

	return [r, x, y];
}
