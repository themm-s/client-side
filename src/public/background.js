const STAR_COLOR = '#ffffff';
const STAR_SIZE = 1.2;
const STAR_MIN_SCALE = 0.2;
const OVERFLOW_THRESHOLD = 50;
const STAR_COUNT = (window.innerWidth + window.innerHeight) / 14;

let canvas,
    context,
    scale = 1,
    width,
    height,
    stars = [],
    pointerX,
    pointerY,
    velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0003 },
    touchInput = false;

function generate() {
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < STAR_COUNT; i++) {
        const star = {
            x: centerX,
            y: centerY,
            z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
        };

        placeStar(star);
        stars.push(star);
    }
}

function placeStar(star) {
    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * (width + height)) / 2;

    star.x += Math.cos(angle) * radius;
    star.y += Math.sin(angle) * radius;
}

function recycleStar(star) {
    let direction = 'z';
    let vx = Math.abs(velocity.x),
        vy = Math.abs(velocity.y);

    if (vx > 1 || vy > 1) {
        let axis;

        if (vx > vy) {
            axis = Math.random() < vx / (vx + vy) ? 'h' : 'v';
        } else {
            axis = Math.random() < vy / (vx + vy) ? 'v' : 'h';
        }

        if (axis === 'h') {
            direction = velocity.x > 0 ? 'l' : 'r';
        } else {
            direction = velocity.y > 0 ? 't' : 'b';
        }
    }

    star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE);

    if (direction === 'z') {
        star.z = 0.1;
        star.x = Math.random() * width;
        star.y = Math.random() * height;
    } else if (direction === 'l') {
        star.x = -OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
    } else if (direction === 'r') {
        star.x = width + OVERFLOW_THRESHOLD;
        star.y = height * Math.random();
    } else if (direction === 't') {
        star.x = width * Math.random();
        star.y = -OVERFLOW_THRESHOLD;
    } else if (direction === 'b') {
        star.x = width * Math.random();
        star.y = height + OVERFLOW_THRESHOLD;
    }
}

function resize() {
    scale = window.devicePixelRatio || 1;
    width = window.innerWidth * scale;
    height = window.innerHeight * scale;

    canvas.width = width;
    canvas.height = height;

    stars.forEach(placeStar);
}

function step() {
    context.clearRect(0, 0, width, height);
    update();
    render();
    requestAnimationFrame(step);
}

function update() {
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;
    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    stars.forEach((star) => {
        star.x += velocity.x * star.z;
        star.y += velocity.y * star.z;
        star.x += (star.x - width / 2) * velocity.z * star.z;
        star.y += (star.y - height / 2) * velocity.z * star.z;
        star.z += velocity.z;

        if (
            star.x < -OVERFLOW_THRESHOLD ||
            star.x > width + OVERFLOW_THRESHOLD ||
            star.y < -OVERFLOW_THRESHOLD ||
            star.y > height + OVERFLOW_THRESHOLD
        ) {
            recycleStar(star);
        }
    });
}

function render() {
    stars.forEach((star) => {
        context.beginPath();
        context.lineCap = 'round';
        context.lineWidth = STAR_SIZE * star.z * scale;
        context.globalAlpha = 0.5 + 0.5 * Math.random();
        context.strokeStyle = STAR_COLOR;

        context.beginPath();
        context.moveTo(star.x, star.y);

        var tailX = velocity.x,
            tailY = velocity.y;

        if (Math.abs(tailX) < 0.1) tailX = 0.5;
        if (Math.abs(tailY) < 0.1) tailY = 0.5;

        context.lineTo(star.x + tailX, star.y + tailY);

        context.stroke();

        context.fillStyle = STAR_COLOR;
        context.beginPath();
        context.arc(star.x, star.y, STAR_SIZE * star.z, 0, Math.PI * 2);
        context.fill();
    });
}

function movePointer(x, y) {
    if (typeof pointerX === 'number' && typeof pointerY === 'number') {
        let ox = x - pointerX,
            oy = y - pointerY;

        velocity.tx -= (ox / (8 * scale)) * (touchInput ? 1 : -1) * 0.02;
        velocity.ty -= (oy / (8 * scale)) * (touchInput ? 1 : -1) * 0.02;
    }

    pointerX = x;
    pointerY = y;
}

function onMouseMove(event) {
    touchInput = false;
    movePointer(event.clientX, event.clientY);
}

function onTouchMove(event) {
    touchInput = true;
    movePointer(event.touches[0].clientX, event.touches[0].clientY, true);
    event.preventDefault();
}

function onMouseLeave() {
    pointerX = null;
    pointerY = null;
}

function initStars() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    resize();
    window.onresize = resize;
    document.onmousemove = onMouseMove;
    document.ontouchmove = onTouchMove;
    document.ontouchend = onMouseLeave;
    document.onmouseleave = onMouseLeave;
    generate();
}

function animateStars() {
    step();
}

function clearStars() {
    stars = [];
}

export { initStars, animateStars, clearStars };
