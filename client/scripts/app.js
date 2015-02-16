//Chat Settings
var settings = {
  currentRoom: 'lobby',
  username: 'anonymous', 
}

var friendList = {};
//Adds friend to friendlist
var addFriend = function(friendName){
  friendList[friendName] = !friendList[friendName];
  console.log(friendList);
}

//sets current room
var setRoom = function(room){
  settings.currentRoom = room;
  console.log(settings.currentRoom);
}


//gets messages from server
var getMessages = function(func, roomname){
  $.ajax({
    url: "https://api.parse.com/1/classes/chatterbox",
    type: 'GET',
    data: 'order=-createdAt',
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
    var roomList = {}

    $('.messageList').empty();
  _.each(data.results, function(msgObj){
    var friend = '';
    if(friendList[msgObj.username] === true){
      friend = 'friend';
    }
    roomList[msgObj.roomname] = true;
    // if(roomname === 'undefined'){
    //   roomname = '';
    // }
    if(msgObj.roomname === roomname){
      $('.messageList').append(
        '<div class="message">' +
        '<a class="username '+ friend + '" href="#" onclick=addFriend("'+escapeInput(msgObj.username)+'");>' + escapeInput(msgObj.username) + '</a>' + ': ' +
        '<span class="messageContent">'+ escapeInput(msgObj.text) + '</span>' + '<br>' +
        '<span class="time">'+ escapeInput(msgObj.createdAt) + '</span>' +
        '</div>'
      );
      $("#roomSelect").empty();
      for (var room in roomList){
        $("#roomSelect").append('<option value='+room+'>'+room+'</option>');
      }
      $("#roomSelect").val(settings.currentRoom);
    }
  });
  $('.messageInput input').empty();
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
  return finalStr.toString();
}

//refreshes messages every 5 seconds
setInterval(function(){
  getMessages(displayMessages, settings.currentRoom);
  console.log('chatterbox: refreshing messages');
}, 1000);


//Displays a username if one is defined, otherwise displays input field
var setUserName = function(username){
  settings.username = username;
  console.log(settings.username);
  $('.setUserName').hide();
  $('.showUserName').append('Username: ' + settings.username);
  $('.showUserName').show();
  $('.messageInput').show();

}





























