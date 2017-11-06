
// $.support.cors = true;

// $(document).ready(function(){

//   var server = 'http://103.60.125.67:8080';
//   // var server = "https://103.60.125.67:8443";
//   var userID = '01099868601';
//   var userAPIURL = server + '/api/user/' + userID;
//   var busAPIURL = server + '/api/boarding/list?user_id=' + userID;

//   $.ajax({
//     type: 'get',
//     url: userAPIURL,
//     headers : {
//       'Content-Type':'application/x-www-form-urlencoded'
//     },
//     error: function(error){
//       console.log('유저 정보를 불러올 수 없습니다. ');
//       console.log(error);
//     },
//     success: function(json){
//       console.log(json.data);
//       initUser(json);
//     }
//   });

//   $.ajax({
//     type: 'get',
//     url: busAPIURL,
//     headers : {
//       'Content-Type':'application/x-www-form-urlencoded'
//     },
//     error: function(error){
//       console.log('버스 정보를 불러올 수 없습니다. ');
//       console.log(error);
//     },
//     success: function(json){
//       console.log(json.data);
//       initBus(json);
//     }
//   });

// });

function initUser(jsonData){

  $('.userName').text(jsonData.data.userName.toString());
  $('.userPhone').text(jsonData.data.userId.toString());
  
  if(jsonData.data.hasOwnProperty('userEmail')){
    $('.userEmail').append(jsonData.data.userEmail.toString());
  }
}

function initBus(jsonData){

  var latestDay = 0;
  var latestDaySeq = 0;

  for(i = 0; i < jsonData.data.length; i++){
    if(jsonData.data[i].boardingDay > latestDay){
      latestDay = jsonData.data[i].boardingDay;
      latestDaySeq = i;
    }
  }

  var busInfoList = ['boardingDay', 'boardingTime', 'stopNameOn', 'boardingYn', 'lineName', 'lineDesc', 'payMoney'];

  for(i=0; i < busInfoList.length; i++){
    var infoQuery = $('.'+busInfoList[i]);

    if(typeof jsonData.data[latestDaySeq][busInfoList[i]] == 'string'){
      infoQuery.text(jsonData.data[latestDaySeq][busInfoList[i]].toString());
    }
    else{
      infoQuery.text(jsonData.data[latestDaySeq][busInfoList[i]]);
    }
  }

  initMap(jsonData.data[latestDaySeq]);

  $('.listBus').empty().html(listbusItems(jsonData.data));

}

function initMap(jsonData){

  var busLat = jsonData.busLat;
  var busLng = jsonData.busLng;

  var googleMapStr = "<iframe width='300' height='300' frameborder='0' style='border: 0;' src='https://www.google.com/maps/embed/v1/view?key=AIzaSyAvr4zHR2ixhVBJbL4Bg74Vz1zbPnCPq6s&center="+busLat+","+busLng+"&zoom=18&maptype=satellite' allowfullscreen></iframe>";

  $('#map').html(googleMapStr);

}

function openNavi(evt, Name) {
    var i, tablinks;
    var x = document.getElementsByClassName("div_navi");

    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }

    tablinks = document.getElementsByClassName("tablink");

    for(i=0; i < x.length; i++){
      tablinks[i].className = tablinks[i].className.replace(" w3-blue-gray", " w3-Khaki");
    }

    if(Name == "Dash"){
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "block";  
      }
    }
    else{
      document.getElementById(Name).style.display = "block";  
    }
    
    evt.currentTarget.className = evt.currentTarget.className.toString().replace(" w3-Khaki", " w3-blue-gray");
}

function listbusItems(jsonData){
  var strHtml = new Array();

  var busInfoList = ['boardingYn', 'stopNameOn', 'boardingDay', 'boardingTime'];

  for(i = 0; i < jsonData.length; i++){

    var lineName = jsonData[i].lineName.toString();
    var boardingYn = jsonData[i].boardingYn.toString();
    var stopNameOn = jsonData[i].stopNameOn.toString();
    var boardingDay = jsonData[i].boardingDay.toString();
    var boardingTime = " ";
    if(typeof jsonData[i].boardingTime == 'string'){
      var boardingTime = jsonData[i].boardingTime.toString();
    }

    strHtml.push("<button class='w3-button listlink w3-Khaki' style='width: 280px; text-align: center; display: block; margin: 10px -57px 0; border-radius: 5px;' onclick='listbusItemsClick("+i+")'> " + jsonData[i].boardingDay.toString()  + " | " + lineName+ "</button>");
    strHtml.push("<div class='listBusDetails"+i+" w3-animate-opacity' style='display: none; width: 280px; margin: -1px -57px 10px; background-color: #FFFFCC;'><table><tr><td><p>탑승 여부: </p></td><td><p class='boardingYn'>"+boardingYn+"</p></td></tr><tr><td><p>태깅 장소: </p></td><td><p class='stopNameOn'>"+stopNameOn+"</p></td></tr><tr><td><p>탑승 일시: </p></td><td><p class='boardingDay&Time'>"+boardingDay + " " + boardingTime+"</p></td></tr></table></div>");
  }
  return strHtml;
}

var currentBusDetailSeq = -1;

function listbusItemsClick(seq){

  $("[class^=listBusDetails]").hide();
  // console.log($("[class^=listlink]"));

  // for(i = 0 ; i < $("[class^=listlink]").length; i++){
  //   $("[class^=listlink]")[i].className.replace(" w3-blue-gray", " w3-pale-yellow")
  // }

  if(currentBusDetailSeq != seq){
    $(".listBusDetails"+seq).show();
    
    currentBusDetailSeq = seq;
  }
  else{
    currentBusDetailSeq = -1;
  }
}