
var canvas, context, stations;
var jsonData, img;

var hover = false, id, prvid;
var _i, _b;

var PI2 = Math.PI * 2;
var ringX, ringY, ringRadius, ingCounter, ringCounterVelocity, ringAlpha, ringAlphaVelocity;

$.support.cors = true;

// $(document).ready(function(){
// 	initDraw();
// });

function initDraw(Data){

	jsonData = JSON.parse('{ "firstSta":"사당역" ,"secondSta": "양재역", "lastSta":"잠실역" ,"busLoca" : [true, true, true, false, false, false, false]}');
	if(Data != null){
		jsonData = Data;
		// console.log(Data);
	}
	
	canvas = document.getElementById("busmap");
	context = canvas.getContext("2d");

	context.canvas.height = 130;

	renderStations();context.clearRect(0, 0, canvas.width, canvas.height);
	renderBusLocation();
	renderRing();

	canvas.addEventListener("mousemove", mouseMove, false);
	
}

function clearRender(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	renderStations();
	renderBusLocation();
}

function renderStations(){

	context.beginPath();
	context.strokeStyle="#F8B200";
	context.lineWidth = 5;
	context.moveTo(10,100);
	context.lineTo(290,100);
	context.stroke();

	stations = [
		{x:60, y:100, r:10, sr:0, er: 2*Math.PI},
		{x:150, y:100, r:10, sr:0, er: 2*Math.PI},
		{x:240, y:100, r:10, sr:0, er:2*Math.PI}
	];
	
	var busInfoData = [
		{ta : "start", x: 10, y: 140, StaName : jsonData.firstSta, StaStop: jsonData.busLoca[1] ,StaIsThru: (jsonData.busLoca[0] && jsonData.busLoca[1] && jsonData.busLoca[2])}, 
		{ta : "center", x: 150, y: 140, StaName : jsonData.secondSta, StaStop: jsonData.busLoca[3] , StaIsThru: (jsonData.busLoca[2] && jsonData.busLoca[3] && jsonData.busLoca[4])},
		{ta : "right", x: 290, y: 140, StaName : jsonData.lastSta, StaStop: jsonData.busLoca[5] , StaIsThru: (jsonData.busLoca[4] && jsonData.busLoca[5] && jsonData.busLoca[6])}
	];

	for(_i = 0; _b = stations[_i]; _i ++){
		context.beginPath();
		context.strokeStyle = (hover && id === _i) ? "#607D8B" : "#F8B200";
		context.fillStyle = (hover && id === _i) ? "#ffffff" : "#595857";
		context.arc(stations[_i].x, stations[_i].y, stations[_i].r, stations[_i].sr, stations[_i].er);
		context.fill();
		context.stroke();
		context.closePath();
	}

	img = new Image();
	img.src = "./marker.svg";
	context.drawImage(img, 215, 35, 50, 50);

	for(_i = 0; _b = stations[_i]; _i ++){
		if(hover && id === _i){
			$('.StaName').text(busInfoData[_i].StaName);
			if(busInfoData[_i].StaIsThru){
				$('.StaIsThru').text("통과됨");
			}
			else{
				if(busInfoData[_i].StaStop){
					$('.StaIsThru').text("정차중");
				}
				else{
					$('.StaIsThru').text("정차예정");
				}
			}
		}
	}
}

function renderBusLocation(){

	context.save();

	var busPosDefault = [30, 60, 105, 150, 195, 240 ,270];
	var currBusPos = 0;
	for(i = 0; i < busPosDefault.length; i++){
		if(jsonData.busLoca[i]){
			currBusPos = busPosDefault[i];
		}
	}

	context.textAlign = "center";

	context.fillStyle = "#595857";
	context.font = '40px fontawesome';
	context.fillText("\uf207",currBusPos,85);
	context.restore();
}

function renderRing(){

	var busPosDefault = [30, 60, 105, 150, 195, 240 ,270];
	var currBusPos = 0;
	for(i = 0; i < busPosDefault.length; i++){
		if(jsonData.busLoca[i]){
			currBusPos = busPosDefault[i];
		}
	}

	ringX = currBusPos;
    ringY = 85;
    ringRadiusX = 50;
    ringRadiusY = 75;
    ringCounter = 0;
    ringCounterVelocity = 1.3;
    ringAlpha = 0;
    ringAlphaVelocity = 0.05;

	requestAnimationFrame(animate);
}

function animate(){
	 // return if the animation is complete
    if (ringCounter > 100) {
    	ringCounter = 0;
    	requestAnimationFrame(animate);
        return;
    }

    // otherwise request another animation loop
   requestAnimationFrame(animate);

   context.save();

    // ringCounter<100 means the ring is expanding
    // ringCounter>=100 means the ring is shrinking
    if (ringCounter < 100) {
        // expand the ring using easeInCubic easing
        ringRadiusX = easeInCubic(ringCounter, 0, 15, 100);
        ringRadiusY = easeInCubic(ringCounter, 0, 30, 100);
    } 

    if(ringCounter < 50){
    	ringAlpha += ringAlphaVelocity;
    }
    else{
    	if(ringAlpha <= 0.1){
    		ringAlpha = 0;
    	}
    	else{
    		ringAlpha -= ringAlphaVelocity;
    	}
    }
    // else {
    //     // shrink the ring using easeOutCubic easing
    //     ringRadiusX = easeOutCubic(ringCounter - 100, 15, -15, 100);
    //     ringRadiusY = easeOutCubic(ringCounter - 100, 30, -30, 100);
    // }

    // draw the ring at the radius set using the easing functions
    // context.fillRect(0, 0, canvas.width, canvas.height);
    
    clearRender();
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = "#595857";
    context.globalAlpha = ringAlpha;
    context.ellipse(ringX, ringY, ringRadiusX, ringRadiusY, 90 * Math.PI/180, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    context.restore();

    // increment the ringCounter for the next loop
    ringCounter += ringCounterVelocity;
}

//  Robert Penner's easing functions
//
//  https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
//
//  now=elapsed time,
//  startValue=value at start of easing,
//  deltaValue=amount the value will change during the easing,
//  duration=total time for easing

function easeInCubic(now, startValue, deltaValue, duration) {
    return deltaValue * (now /= duration) * now * now + startValue;
}

// function easeOutCubic(now, startValue, deltaValue, duration) {
//     return deltaValue * ((now = now / duration - 1) * now * now + 1) + startValue;
// }

function mouseMove(evt) {
    var rect = canvas.getBoundingClientRect(),
    x = evt.clientX - rect.left,
    y = evt.clientY - rect.top + 40; // 높이 오차 40px

    hover = false;

    for(var i = stations.length - 1, b; b = stations[i]; i--) {
        if(x >= b.x - b.r*2 && x <= b.x + b.r 
        	&& y >= b.y - b.r && y <= b.y + b.r*2) {
            // The mouse honestly hits the rect
            hover = true;
            id = i;
            break;
        }
    }

    renderStations();
}