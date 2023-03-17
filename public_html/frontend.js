/*
This will get the values of the elemnts of the DOM so that
the user input will be retrieved. Then whenever the send
message button is clicked it will send a request to the
server to store the value in a database.
Author: Luke Laurie
Date: 2/28/2023
*/
// gets the needed elements from the DOM
textArea = document.getElementById("messageSection");
button = document.getElementById("submit");
aliasInput = document.getElementById("alias");
messageInput = document.getElementById("message");
// the array containing all of the messages in the corect order
messages = [];


/*
 * This will clear out all of the elements in the text div, then
 * it will redislay all of the possible messages into the div.
 */
function displayMessages() {
  // clears all the children
  while (textArea.firstChild) {
    textArea.removeChild(textArea.firstChild);
  }
  // adds all the messages
  for (i in messages) {
    const curMessage = createMessage(messages[i].alias, messages[i].message);
    textArea.appendChild(curMessage);
  }
}

/*
 * This will create a div containg two h3 elements which can
 * easily be added to the screen in order to display a message.
 * @param {String} alias is the text representing the alias.
 * @param {String} message is the text representing the alias.
 * @return {div} The div containg the full message.
 */
function createMessage(alias, message) {
  alias += ": "
  // creates the needed elements that make up a message
  const messageContainer = document.createElement("div");
  const curAlias = document.createElement("h3");
  const curMessage = document.createElement("h3");
  curAlias.innerText = alias;
  curMessage.innerText = message;
  // adds the correct classes
  messageContainer.setAttribute("class", "message");
  curAlias.setAttribute("class", "nameText");
  curMessage.setAttribute("class", "messageText");
  // adds to the container
  messageContainer.appendChild(curAlias);
  messageContainer.appendChild(curMessage);
  return messageContainer;
}

/*
 * Makes a request to the server to get back all of the messages
 * from the database.
 */
function getMessages() {
  const url = "http://localhost:80/chats";
  fetch(url)
    .then(data => {
      return data.json();
    })
    .then(addMessages => {
      // sets the value of the messages
      messages = addMessages;
      displayMessages();
    })
    .catch(err => {
      console.log(err);
    })
}

/*
 * The event listener on Send Message button which will make
 * a post request to the server with the information achieved
 * from the text fields.
 */
button.addEventListener("click", () => {
  const curAlias = aliasInput.value
  const curMessage = messageInput.value;
  // clears out the message
  messageInput.value = "";
  const url = "http://localhost:80/chats/post";
  // sends the request
  fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alias: curAlias,
        message: curMessage
      })
    })
    // runs get messages so user does not experience a delay
    .then(data => {
      getMessages();
    })
    .catch(err => {
      console.log(err);
    });
});

// call set interval every second
setInterval(getMessages, 1000);
