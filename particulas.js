window.human = false;

var canvasEl = dicument.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}
function updateCoords(e) {
    pointerX = e.clientX || e.touches[0].clientX;
    pointerY = e.clientY || e.touches[0].clientY;
}
function createParticule(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = colors[Math.floor(Math.random() * colors.length)];
    p.radius = Math.random() * 4 + 1;
    p.endPos = setParticuleDirection(p);
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    };
    return p;
}

function setParticuleDirection(p) {
    var angle = Math.random() * 2 * Math.PI;
    var value = Math.random() * 100 + 50;
    var radius = [-1, 1][Math.floor(Math.random() * 2)] * value;
    return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle)
    };
}

function updateParticule(p) {
    var dx = (p.endPos.x - p.x) / 10;
    var dy = (p.endPos.y - p.y) / 10;
    p.x += dx;
    p.y += dy;
    p.radius *= 0.96;
}

function animateParticules(x, y) {
    var particules = [];
    for (var i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    animate(particules);
}

function animate(particules) {
    var animateLoop = function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        for (var i = 0; i < particules.length; i++) {
            var p = particules[i];
            p.draw();
            updateParticule(p);
        }
        requestAnimationFrame(animateLoop);
    };
    animateLoop();
}

var render = anime({
    duration: Infinity,
    update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});

document.addEventListener(tap, function (e) {
    window.human = true;
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
}, false);

setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);