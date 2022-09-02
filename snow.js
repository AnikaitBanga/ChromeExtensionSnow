let snowing = false;

let snowAlreadyMoving = false;

let snowNr = 100;

let color = '#ffffff';

let speed = 1.0;

let snowMinSize = 8;

let snowMaxSize = 26;

let refreshRate = 50; //millisecond

let snowValue = document.createTextNode('\u2022');

let marginTop, marginRight, marginLeft, marginBottom;

let snow = [];
let radian = [];
let radianSpeed = [];
let amplitude = [];

let mouseX, mouseY;

function randomInt(from, to) {
    return from + Math.floor((to - from) * Math.random())
}

function init(){
    
chrome.storage.sync.get(['settings'], (data) =>{
    if(data.settings)
    {
        snowing = data.settings.snowing;
        snowNr = data.settings.snowNr;
        speed = data.settings.speed;
        color = data.settings.color;
    }
    initSnow();
});
}

function initSnow() {

    if(!snowing) 
        return;
    marginTop = window.pageYOffset;
    marginLeft = window.pageXOffset;
    marginRight = marginLeft + document.body.clientWidth - 15;
    marginBottom = marginTop + window.innerHeight - 5;

    for (let i = 0; i < snowNr; i++) {
        let elem = document.createElement('span');
        elem.id = `flake${i}`;
        elem.appendChild(snowValue.cloneNode(false));
        elem.size = randomInt(snowMinSize, snowMaxSize);
        elem.style.fontSize = `${elem.size}px`;
        elem.style.color = color;
        elem.style.zIndex = 1000;
        elem.classList.add('snowflake');
        elem.posX = randomInt(marginLeft, marginRight - elem.size);
        elem.posY = randomInt(marginTop, marginBottom - 2 * elem.size);

        radian[i] = 0;
        radianSpeed[i] = Math.random() / 10 + 0.0314;
        amplitude[i] = Math.random() * 20;
        elem.style.left = elem.posX + 'px';
        elem.style.top = elem.posY + 'px';
        elem.speed = speed * elem.size / 5;
        snow[i] = elem;
        document.body.appendChild(elem);
    }

    if(!snowAlreadyMoving)
    {
        snowAlreadyMoving = true;
        moveSnow();
    }
}

function moveSnow() {
    if(!snowing) 
        return;
    for (let i = 0; i < snowNr; i++) {
        snow[i].posY += snow[i].speed;
        radian[i] += radianSpeed[i];
        let posX = snow[i].posX + Math.sin(radian[i]) * amplitude[i];
        snow[i].style.top = snow[i].posY + 'px';
        snow[i].style.left = posX + 'px';

        if (snow[i].posY < marginTop) {
            snow[i].posY = randomInt(marginTop, marginBottom - 2 * elem.size);
        }
        if (Math.abs(mouseX - posX) < 20 && Math.abs(mouseY - snow[i].posY) < 20) {
            snow[i].posY = marginTop;
        }
        if (snow[i].posY >= marginBottom - 2 * snow[i].size || posX > (marginRight - 3 * amplitude[i])) {
            snow[i].posX = randomInt(marginLeft, marginRight - snow[i].size);
            snow[i].posY = marginTop;
        }
    }

    setTimeout("moveSnow()", refreshRate);
}

function resize() {
    marginTop = window.pageYOffset;
    marginLeft = window.pageXOffset;
    marginRight = marginLeft + document.body.clientWidth - 15;
    marginBottom = marginTop + window.innerHeight - 5;
}

window.addEventListener('load', init);
window.addEventListener('resize', resize);
window.addEventListener('scroll', resize);
window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(speed !== request.settings.speed) {
            speed = request.settings.speed;
            document.querySelectorAll('.snowflake').forEach(function(snow){
                snow.speed = speed * snow.size / 5;
            })
        }
        if(color !== request.settings.color) {
            color = request.settings.color;
            document.querySelectorAll('.snowflake').forEach(function(snow){
                snow.style.color = color;
            })
        }
        if(snowNr !== request.settings.snowNr) {
            snowNr = request.settings.snowNr;
            document.querySelectorAll('.snowflake').forEach(function(snow){
                snow.parentNode.removeChild(snow);
            })
            initSnow();
        }
        if(snowing !== request.settings.snowing) {
            snowing = request.settings.snowing;
            if(snowing) {
                snowAlreadyMoving = false;
                initSnow();
            }
            else{
                document.querySelectorAll('.snowflake').forEach(function(snow){
                    snow.parentNode.removeChild(snow);
                })
            }
        }
    }
)