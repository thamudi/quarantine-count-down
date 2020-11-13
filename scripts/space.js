/* SPACE AND STARS SCRIPT ~ by Günther Molina */

const FRM_RATE = 30,             //frames per second
    MAX_QUAN = 100,            //Star quantity
    MAX_SIZE = 2,              //max size of stars
    MIN_SIZE = 1,              //min size of stars
    MAX_BLUR = MAX_SIZE * 10,  //max brightness of stars
    MIN_BLUR = 0.1,            //min brightness of stars
    OPC_STAR = 1,              //opacity of stars
    INN_FADE = 30,             //fade in %
    OUT_FADE = 50,             //fade out %
    RGB_PROB = 5,              //probability of color change
    RGB_COLOR = [255, 255, 255],  //default color
    MAX_COLOR = [255, 255, 0],     //color max
    MIN_COLOR = [255, 0, 0];       //color min

let arrSpace = [],
    objCont = {},
    objCanvas = {},
    objCtx = {},
    innPrc = 0,
    outPrc = 0;


/////Functions
function init() {
    objCont = document.getElementById("cont");
    objCanvas = document.getElementById("space");
    objCanvas.width = objCont.offsetWidth;
    objCanvas.height = objCont.offsetHeight;
    objCtx = objCanvas.getContext("2d");

    arrFill();
    setInterval(drwStar, 1000 / FRM_RATE);
}

function arrFill() {
    for (let j = 0; j < MAX_QUAN; j++) {
        arrSpace.push(new Star());
    }
}

function drwStar() {
    objCtx.beginPath();
    objCtx.clearRect(0, 0, objCanvas.width, objCanvas.height);

    arrSpace.push(new Star());
    arrSpace.shift();

    for (let i = 0; i < arrSpace.length && i < MAX_QUAN; i++) {
        innPrc = (INN_FADE * MAX_QUAN) / 100;
        outPrc = (OUT_FADE * MAX_QUAN) / 100;

        if (i < outPrc) {
            arrSpace[i].opacity = (i * OPC_STAR) / outPrc;
        } else if (i > MAX_QUAN - innPrc) {
            arrSpace[i].opacity -= (i - (MAX_QUAN - innPrc)) / innPrc;
        }

        arrSpace[i].drawStar();
        arrSpace[i].opacity = OPC_STAR;
    }
}
/////Objects
class Star {
    constructor() {
        this.x = objCanvas.width * Math.random();
        this.y = objCanvas.height * Math.random();
        this.size = Math.round(Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE);
        this.blur = Math.random() * (MAX_BLUR - MIN_BLUR) + MIN_BLUR;
        this.opacity = OPC_STAR;
        this.color = (Math.random() <= (RGB_PROB / 100)) ?
            [Math.round(Math.random() * (MAX_COLOR[0] - MIN_COLOR[0]) + MIN_COLOR[0]),
            Math.round(Math.random() * (MAX_COLOR[1] - MIN_COLOR[1]) + MIN_COLOR[1]),
            Math.round(Math.random() * (MAX_COLOR[2] - MIN_COLOR[2]) + MIN_COLOR[2])] :
            RGB_COLOR;

        this.drawStar = function () {
            objCtx.beginPath();
            objCtx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            objCtx.fillStyle = "rgba(" + this.color[0] + "," +
                this.color[1] + "," +
                this.color[2] + "," +
                this.opacity + ")";
            objCtx.shadowColor = "rgba(" + this.color[0] + "," +
                this.color[1] + "," +
                this.color[2] + "," +
                this.opacity + ")";
            objCtx.shadowBlur = this.blur;
            objCtx.fill();
        };
    }
}

document.addEventListener("DOMContentLoaded", init);