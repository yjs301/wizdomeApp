
var canvas, context, stations;
var jsonData;

var hover = false, id, prvid;
var _i, _b;

$.support.cors = true;

$(document).ready(function(){
	initDraw();
});

function initDraw(){
	canvas = document.getElementById("busmap");
	context = canvas.getContext("2d");

	context.canvas.height = 130;

	context.beginPath();
	context.strokeStyle="#F8B200";
	context.lineWidth = 5;
	context.moveTo(10,100);
	context.lineTo(290,100);
	context.stroke();

	getAPIdata();
	renderStations();
	drawBusLocation();

	canvas.addEventListener("mousemove", mouseMove, false);
	
}

function getAPIdata(){

	//전, 현, 다음 정류장 이름과 버스 위치정보
	jsonData = JSON.parse('{ "firstSta":"정류소1" ,"secondSta": "정류소2", "lastSta":"정류소3" ,"busLoca" : [true, true, false, false, false, false, false]}');

}

function renderStations(){
	stations = [
		{x:60, y:100, r:10, sr:0, er: 2*Math.PI},
		{x:150, y:100, r:10, sr:0, er: 2*Math.PI},
		{x:240, y:100, r:10, sr:0, er:2*Math.PI}
	];
	
	var namesInfo = [
		{ta : "start", x: 10, y: 140, js : jsonData.firstSta}, 
		{ta : "center", x: 150, y: 140, js : jsonData.secondSta},
		{ta : "right", x: 290, y: 140, js : jsonData.lastSta}
	];

	for(_i = 0; _b = stations[_i]; _i ++){
		context.beginPath();
		context.strokeStyle = (hover && id === _i) ? "#607D8B" : "#F8B200";
		context.fillStyle = (hover && id === _i) ? "#ffffff" : "#595857";
		context.arc(stations[_i].x, stations[_i].y, stations[_i].r, stations[_i].sr, stations[_i].er);
		context.fill();
		context.stroke();
	}

	for(_i = 0; _b = stations[_i]; _i ++){
		if(hover && id === _i){
			$('.StaInfo').text(namesInfo[_i].js);
		}
	}
}

function drawBusLocation(){

	context.save();

	var busPosDefault = [30, 60, 105, 150, 195, 240 ,270];
	var currBusPos = 0;
	for(i = 0; i < busPosDefault.length; i++){
		if(jsonData.busLoca[i]){
			currBusPos = busPosDefault[i];
		}
	}

	context.beginPath();
	context.textAlign = "center";
	context.fillStyle = "#595857";
	context.font = '40px fontawesome';
	context.fillText("\uf207",currBusPos,85);
	context.stroke();

	var img = new Image();
	img.src = "./marker.svg";
	img.onload = function(){
		context.drawImage(img, 215, 35, 50, 50);
	}
	context.restore();
	// setInterval(drawBusIcon,100);
	// setInterval(rotate, 100);
}

// function drawBusIcon(){
// 	var c = document.getElementById("busmap");
// 	var context = c.getContext("2d");

// 	var canvasWidth = jsonData.busLoca;
// 	var canvasHeight = 90;
//   // Clear the canvas
//   context.clearRect(0, 0, canvasWidth, canvasHeight);
	
//   // Move registration point to the center of the canvas
//   context.translate(canvasWidth/2, canvasWidth/2);
	
//   // Rotate 1 degree
//   context.rotate(Math.PI / 180);
    
//   // Move registration point back to the top left corner of canvas
//   context.translate(-canvasWidth/2, -canvasWidth/2);

// 	context.textAlign = "center";
// 	context.font = '40px fontawesome';
// 	context.fillText("\uf207",canvasWidth/2, canvasHeight/2);

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