
var canvas, context, stations;

$.support.cors = true;

$(document).ready(function(){
	initDraw();
	getAPIdata();
});

function initDraw(){
	canvas = document.getElementById("busmap");
	context = canvas.getContext("2d");

	canvas.addEventListener("mousemove", mouseMove, false);

	context.beginPath();
	context.strokeStyle="#F8B200";
	context.lineWidth = 5;
	context.moveTo(30,100);
	context.lineTo(270,100);
	context.stroke();

	context.beginPath();
	context.arc(30, 100, 10 ,0, 2*Math.PI);
	context.strokeStyle="#F8B200";
	context.fillStyle="#595857";
	context.lineWidth = 3;
	context.fill();
	context.stroke();

	context.beginPath();
	context.arc(150, 100, 10 ,0, 2*Math.PI);
	context.strokeStyle="#F8B200";
	context.fillStyle="#595857";
	context.fill();
	context.stroke();

	context.beginPath();
	context.arc(270, 100, 10 ,0, 2*Math.PI);
	context.strokeStyle="#F8B200";
	context.fillStyle="#595857";
	context.fill();
	context.stroke();
}

function getAPIdata(){

	//전, 현, 다음 정류장 이름과 버스 위치정보
	var jsonData = JSON.parse('{ "firstSta":"정류소1" ,"currSta": "정류소2", "lastSta":"정류소3" ,"busLoca" : "80"}');

	drawBusLocation(jsonData);
}

function drawBusLocation(jsonData){

	stations = new Array();

	context.beginPath();
	context.textAlign = "start";
	context.font = '20px malgun-gothic';
	context.fillText(jsonData.firstSta,10,140);
	context.stroke();

	context.beginPath();
	context.textAlign = "center";
	context.font = '20px malgun-gothic';
	context.fillText(jsonData.currSta,150,140);
	context.stroke();

	context.beginPath();
	context.textAlign = "right";
	context.font = '20px malgun-gothic';
	context.fillText(jsonData.lastSta,290,140);
	context.stroke();

	context.beginPath();
	context.textAlign = "center";
	context.font = '40px fontawesome';
	context.fillText("\uf207",jsonData.busLoca,90);
	context.stroke();

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

function mouseMove(event){
	var position = getMousePos(canvas, event);
	
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}