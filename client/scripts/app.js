//Chat Settings
var settings = {
  currentRoom: 'lobby',
  username: 'anonymous'
}


//gets messages from server
var getMessages = function(func, roomname){
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox?=order:createdAt",
    type: 'GET',
    contentType: 'application/json',
    success: function(data){
      console.log(data);
      func(data, roomname);
    }
  });
}

//sends message
var sendMessage = function(un, txt, rn){
  var message = {
    "username": un,
    "text": txt,
    "roomname": rn
  }
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('chatterbox: Message sent');
      console.log(data);
    },
    error: function(data) {
      console.error('chatterbox: Failed to send message')
    }
  })
}

//displays message (callback for getMessages)
var displayMessages = function(data, roomname){
    $('.messageList').empty();
  _.each(data.results, function(msgObj){
    if(msgObj.roomname === roomname){
      $('.messageList').append(
        '<div class="message">' +
        '<span class="username">'+ escapeInput(msgObj.username) + '</span>' + ': ' +
        '<span class="messageContent">'+ escapeInput(msgObj.text) + '</span>' + '<br>' +
        '<span class="time">'+ escapeInput(msgObj.createdAt) + '</span>' +
        '</div>'
      );
    }
  });
}

//returns an escaped string
var escapeInput = function(str){
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  var str1 = div.innerHTML;
  var div = document.createElement('div');
  div.innerHTML = str1;
  var child = div.childNodes[0];
  var finalStr = child ? child.nodeValue : '';

  return finalStr;
}

//refreshes messages every 5 seconds
setInterval(function(){
  getMessages(displayMessages, settings.currentRoom);
  console.log('chatterbox: refreshing messages');
}, 1000);


//Hides showUserName div and message send div automatically
$('.showUserName').hide();
$('.messageInput').hide();
//Displays a username if one is defined, otherwise displays input field
var setUserName = function(username){
  settings.username = username;
  console.log(settings.username);
  $('.setUserName').hide();
  $('.showUserName').append('Username: ' + settings.username);
  $('.showUserName').show();
  $('.messageInput').show();

}





























