
$.support.cors = true;

$(document).ready(function(){

  var server = 'http://103.60.125.67:8080';
  // var server = 'http://192.168.0.15:8080';
  var userID = '01099868601';
  var userAPIURL = server + '/api/user/' + userID;
  var busAPIURL = server + '/api/boarding/list?user_id=' + userID;

  $.ajax({
    type: 'get',
    url: userAPIURL,
    headers : {
      'Content-Type':'application/x-www-form-urlencoded'
    },
    error: function(error){
      console.log('유저 정보를 불러올 수 없습니다. ');
      console.log(error);
    },
    success: function(json){
      console.log(json.data);
      initUser(json);
    }
  });

  $.ajax({
    type: 'get',
    url: busAPIURL,
    headers : {
      'Content-Type':'application/x-www-form-urlencoded'
    },
    error: function(error){
      console.log('버스 정보를 불러올 수 없습니다. ');
      console.log(error);
    },
    success: function(json){
      console.log(json.data);
      initBus(json);
    }
  });

});

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

  $('.boardingDay').text(jsonData.data[latestDaySeq].boardingDay.toString());
  $('.boardingYn').text(jsonData.data[latestDaySeq].boardingYn.toString());
  $('.lineName').text(jsonData.data[latestDaySeq].lineName.toString());
  $('.lineDesc').text(jsonData.data[latestDaySeq].lineDesc.toString());
  $('.payMoney').text(jsonData.data[latestDaySeq].payMoney.toString() + "원");

  initMap(jsonData.data[latestDaySeq]);

  $('.listBus').empty().html(listbusItems(jsonData.data));

}

function initMap(jsonData){

  var busLat = jsonData.busLat;
  var busLng = jsonData.busLng;

  var googleMapStr = "<iframe width='300' height='300' frameborder='0' style='border: 0;' src='https://www.google.com/maps/embed/v1/view?key=AIzaSyAvr4zHR2ixhVBJbL4Bg74Vz1zbPnCPq6s&center="+busLat+","+busLng+"&zoom=18&maptype=satellite' allowfullscreen></iframe>";

  $('#map').html(googleMapStr);

  // // var busTxt = jsonData.lineSeq + '번 버스'

  // // var coordinates = {
  // //     lat: jsonData.busLat,
  // //     lng: jsonData.busLng
  // // };

  // var busTxt =  '버스';

  // var coordinates = {
  //     lat: 40.785845,
  //     lng: -74.020496
  // };

  // var map = new google.maps.Map(document.getElementById('map'), {
  //     zoom: 14,
  //     center: coordinates,
  //     scrollwheel: false
  // });

  // var measle = new google.maps.Marker({
  //     position: coordinates,
  //     map: map, 
  //     icon: {
  //       url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
  //       size: new google.maps.Size(7, 7),
  //       anchor: new google.maps.Point(3.8, 3.8)
  //     }
  // });

  // var marker = new google.maps.Marker({
  //   position: coordinates,
  //   map: map,
  //   icon: {
  //     url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  //     labelOrigin: new google.maps.Point(75, 32),
  //     size: new google.maps.Size(32, 32),
  //     anchor: new google.maps.Point(16, 32)
  //   },
  //   label: {
  //     text: busTxt,
  //     color: "#C70E20",
  //     fontWeight: "bold"
  //   }
  // });
}

// google.maps.event.addDomListener(window, "load", initMap);

function openNavi(evt, Name) {
    var i, tablinks;
    var x = document.getElementsByClassName("div_navi");

    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }

    tablinks = document.getElementsByClassName("tablink");

    for(i=0; i < x.length; i++){
      tablinks[i].className = tablinks[i].className.replace(" w3-white", " w3-black");
    }

    if(Name == "Dash"){
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "block";  
      }
    }
    else{
      document.getElementById(Name).style.display = "block";  
    }
    
    evt.currentTarget.className = evt.currentTarget.className.toString().replace(" w3-black", " w3-white");

    // if(evt.currentTarget.className.toString().indexOf(" w3-white") == -1){
    //   // evt.currentTarget.className += " w3-white";
    // }
    
}

function listbusItems(jsonData){
  var strHtml = new Array();

  for(i = 0; i < jsonData.length; i++){

    var boardingDay = jsonData[i].boardingDay.toString();
    var boardingYn = jsonData[i].boardingYn.toString();
    var lineName = jsonData[i].lineName.toString();
    var lineDesc = jsonData[i].lineDesc.toString();
    var payMoney = jsonData[i].payMoney.toString();

    strHtml.push("<button class='w3-button tablink w3-yellow' style='text-align: center; display: block; border-radius: 5px;' onclick='listbusItemsClick("+i+")'> 탑승 날짜: " + jsonData[i].boardingDay.toString() + "</button>");
    strHtml.push("<div class='listBusDetails"+i+" w3-animate-opacity' style='display: none; width: 280px; border: 1px solid black;'><table><tr><td><p>탑승 날짜</p></td><td><p class='boardingDay'>"+boardingDay+"</p></td></tr><tr><td><p>탑승 여부</p></td><td><p class='boardingYn'>"+boardingYn+"</p></td></tr><tr><td><p>노선 이름</p></td><td><p class='lineName'>"+lineName+"</p></td></tr><tr><td><p>노선 정의</p></td><td><p class='lineDesc'>"+lineDesc+"</p></td></tr><tr><td><p>지불 금액</p></td><td><p class='payMoney'>"+payMoney+"</p></td></tr></table></div>");
  }
  return strHtml;
}

var currentBusDetailSeq = -1;

function listbusItemsClick(seq){

  $("[class^=listBusDetails]").hide();

  if(currentBusDetailSeq != seq){
    $(".listBusDetails"+seq).show();
    
    currentBusDetailSeq = seq;
  }
  else{
    currentBusDetailSeq = -1;
  }
}