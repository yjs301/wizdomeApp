
$.support.cors = true;

$(document).ready(function(){

  var server = 'http://192.168.0.15:8080';
  var userID = '01099868601';
  var userAPIURL = server + '/api/user/' + userID;
  var busAPIURL = server + '/api/boarding/list?user_id=' + userID;

  $.ajax({
    type: 'get',
    url: userAPIURL,
    headers : {
      "Access-Control-Allow-Origin" : "*"
    },
    error: function(error){
      alert('유저 정보를 불러올 수 없습니다. ');
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
      "Access-Control-Allow-Origin" : "*"
    },
    error: function(error){
      alert('버스 정보를 불러올 수 없습니다. ');
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

}

function initMap(jsonData){

  var busLat = jsonData.busLat;
  var busLng = jsonData.busLng;

  var googleMapStr = "<iframe width='300' height='300' frameborder='0' style='border: 0;' src='https://www.google.com/maps/embed/v1/view?key=AIzaSyAvr4zHR2ixhVBJbL4Bg74Vz1zbPnCPq6s&center="+busLat+","+busLng+"&zoom=18&maptype=satellite' allowfullscreen></iframe>";

  $('.E-busmap').html(googleMapStr);
}

function openNavi(evt, Name) {
    var i, tablinks;
    var x = document.getElementsByClassName("div_navi");

    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }

    tablinks = document.getElementsByClassName("tablink");

    for(i=0; i <= x.length; i++){
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