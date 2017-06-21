$(function(){

//Teken gedeelte
//Roep eerst socket aan, en daarna je whiteboard en je kleur

    var socket = io();
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');

//Start kleur
    var current = {
        color: 'crimson'
    };

// variabele die straks bij gaat houden of je tekent of niet
    var drawing = false;

//Het canvas laten reageren op de muis
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

//kleuren kunnen laten updaten/veranderen
    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

//Socket laten reageren op wanneer er getekend wordt
    socket.on('drawing', onDrawingEvent);

// reageren wanneer de browser van grootte veranderd
    window.addEventListener('resize', onResize, false);
    onResize();

//Lijn tekenen
    function drawLine(x0, y0, x1, y1, color, emit) {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = 3;
        context.stroke();
        context.closePath();

        if (!emit) {
            return;
        }
        var w = canvas.width;
        var h = canvas.height;

//Naar socket sturen, socket het laten broadcasten naar alle ontvangers.
        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color: color
        });
    }

// Wanneer je de muisknop ingedrukt houdt, teken.
    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }

// Wanneer je de muisknop loslaat weer stoppen met tekenen.
    function onMouseUp(e) {
        if (!drawing) {
            return;
        }
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    }

//Lijntje de muis laten volgen, wanneer de muis beweegt.
    function onMouseMove(e) {
        if (!drawing) {
            return;
        }
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
        current.x = e.clientX;
        current.y = e.clientY;
    }

//Kleur veranderen
    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }


// limit the number of events per second
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function () {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

// Teken omgeving doorgeven
    function onDrawingEvent(data) {
        var w = canvas.width;
        var h = canvas.height;
        drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

// make the canvas fill its parent
    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});