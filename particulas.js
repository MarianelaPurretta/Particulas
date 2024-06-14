// Indica si el usuario ha interactuado con la animación
window.human = false;

// Selecciona el elemento canvas y obtiene su contexto 2D para dibujar
var canvasEl = document.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');

// Define el número de partículas a crear y las coordenadas del puntero
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;

// Define el evento tap dependiendo de si el dispositivo soporta eventos táctiles o solo de ratón
var tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';

// Define un array de colores para las partículas
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];

// Función para configurar el tamaño del canvas
function setCanvasSize() {
    // Ajusta el tamaño del canvas al doble del tamaño de la ventana para mayor resolución
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    // Ajusta el tamaño del estilo del canvas al tamaño de la ventana
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    // Escala el contexto del canvas para alta resolución
    canvasEl.getContext('2d').scale(2, 2);
}

// Función para actualizar las coordenadas del puntero basadas en el evento de entrada
function updateCoords(e) {
    pointerX = e.clientX || e.touches[0].clientX;
    pointerY = e.clientY || e.touches[0].clientY;
}

// Función para calcular una dirección y distancia aleatoria para una partícula
function setParticuleDirection(p) {
    var angle = anime.random(0, 360) * Math.PI / 180;
    var value = anime.random(50, 180);
    var radius = [-1, 1][anime.random(0, 1)] * value;
    return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle)
    }
}

// Función para crear una partícula en la posición (x, y)
function createParticule(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    // Asigna un color aleatorio a la partícula
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    // Establece la posición final de la partícula
    p.endPos = setParticuleDirection(p);
    // Define el método para dibujar la partícula
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    return p;
}

// Función para crear un círculo blanco con una transparencia inicial
function createCircle(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = '#FFF';
    p.radius = 0.1;
    p.alpha = .5;
    p.lineWidth = 6;
    // Define el método para dibujar el círculo
    p.draw = function () {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    return p;
}

// Función para renderizar cada partícula en la animación
function renderParticule(anim) {
    for (var i = 0; i < anim.animatables.length; i++) {
        anim.animatables[i].target.draw();
    }
}

// Función para animar las partículas y un círculo en la posición (x, y)
function animateParticules(x, y) {
    var circle = createCircle(x, y);
    var particules = [];
    for (var i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    // Utiliza anime.js para secuenciar las animaciones de las partículas y el círculo
    anime.timeline().add({
        targets: particules,
        x: function (p) { return p.endPos.x; },
        y: function (p) { return p.endPos.y; },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    })
        .add({
            targets: circle,
            radius: anime.random(80, 160),
            lineWidth: 0,
            alpha: {
                value: 0,
                easing: 'linear',
                duration: anime.random(600, 800),
            },
            duration: anime.random(1200, 1800),
            easing: 'easeOutExpo',
            update: renderParticule
        }, 0);
}

// Configura una animación continua que limpia el canvas en cada frame
var render = anime({
    duration: Infinity,
    update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});

// Añade un event listener para el evento tap
document.addEventListener(tap, function (e) {
    window.human = true;
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
}, false);

// Calcula las coordenadas del centro de la ventana
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

// Configura el tamaño del canvas y añade un event listener para ajustar el tamaño del canvas cuando la ventana se redimensiona
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
