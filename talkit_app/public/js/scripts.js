var socket = io();
//var mess = '<li class="message"><div class="userAvatar"><div class="avatar"><img src="img/avatar-placeholder.png" alt="avatar"></img></div></div><div class="message-body"></div></li>';



$('form').submit(function(){
   socket.emit('message', $('#msg').val());
   $('#msg').val('');
   return false;
});

socket.on('message', function(msg){
  var currentDate = new Date();
  var currentTime = currentDate.getHours() + ":" + currentDate.getMinutes();
  if (msg) {
    $('#messages').append('<li class="message"><div class="userAvatar"><div class="avatar"><img src="img/avatar-placeholder.png" alt="avatar"></img></div><span class="currentTime">' + currentTime + '</span></div><div class="message-body">' + msg + '</div></li>').fadeIn(500);
    $("#messages").scrollTop($(document).height());
  }

});
