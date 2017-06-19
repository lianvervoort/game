/* ====================================
Canvas stars, aanroepen in HTML. Canvas verwerken in HTML. bv ;

<canvas id="canvas" width="1350px" height="580px"></canvas>
	
==================================== */

window.onload = init();

function init(){
    // Element 'canvas' uit index.php ophalen
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
    gravity = 0.01;
    bounceFactor = 1;
}
	var balkleur = ["#ffffff","#98eaf9","#12181a","#32373f"];

// Functie ball wordt aangemaakt bepaald kleur en hoe groot de balletjes worden
function Ball(x, y) {
    this.x = x;
    this.y = y;
	this.radius = Math.random()*Math.PI*1;
    this.color = balkleur[Math.floor(Math.random()*balkleur.length)];
    this.vx = Math.random() * 6 - 3;
	this.vy = Math.random() * 6 - 3;
}

// De balletjes worden getekend.
Ball.prototype = {
    draw: function(x,y) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    },

    updateY: function() {
        this.y += this.vy;
        this.vy += gravity;
        if (this.y + this.radius >= H) {
            this.y = H - this.radius;
            this.vy *= -bounceFactor;
        }
        if ((this.y + this.radius) <= (this.radius*2)){//If Ypos of ball < ball radius
            this.y = (0 + this.radius); //bovenkant
            this.vy *= -bounceFactor;
        }
    },

    updateX: function() { //door een combinatie van update Y en X vallen de balletjes schuin + door de zwaartekracht lijkt het overal heen te zweven
        //console.log(this.x);
        this.x += this.vx;
        this.vx += gravity;
        if (this.x + this.radius > W) {//Als Xpos van bal + radius van bal groter is dan width van canvas
            this.x = W - this.radius;//Nieuwe Xpos van bal wordt 1290 - radius van bal
            this.vx *= -bounceFactor;
        }
        if ((this.x + this.radius) <= (this.radius*2)){//If Xpos of ball < ball radius
            this.x = (0 + this.radius); //links
            this.vx *= -bounceFactor;
        }
    }

};

// Reset het canvas, wat canvas nu doet is telkens een balletje opnieuw tekenen en dan gummen.
function clearCanvas() {
    ctx.clearRect(0, 0, W, H);
}

//Deze array behoudt de ballen die zijn gedropt.
var balls = [];
var pageX = 0;
var pageY = 0;

// Wanneer je in het canvas klikt wordt er een balletje gedropt
canvas.addEventListener('mousedown', function(event) {
    CreateBall();
    intervalId = setInterval(CreateBall, 30);

    function CreateBall(){
        // Past de positie van de muis aan
        var rect = canvas.getBoundingClientRect(),
        x = pageX;
        y = pageY;
        // Voegt een balletje toe
        balls.push(new Ball(x, y));
    }
});

canvas.addEventListener('mouseup', function(event){//Clear interval gebruiker mouses down
    //onmouseup cancel interval
    clearInterval(intervalId);
});

window.addEventListener('mousemove', function(event) {
	pageX = event.clientX;
	pageY = event.clientY;
});

// Elke keer wanneer de update wordt uitgevoerd, positie opnieuw berekenen, opnieuw tekenen
(function update() {
    clearCanvas(); //gum het canvas uit en bepaal de positie opnieuw. Als je dit uitzet krijg je getekende lijnen ipv rondjes. 

    for (var i = 0, ball; ball = balls[i]; i++) {
        ball.draw(); // Tekent een nieuw balletje
        ball.updateY(); // Update de nieuwe positie van het balletje Y as
        ball.updateX(); // Update de nieuwe positie van het balletje X as
    }

    requestAnimationFrame(update);
})();