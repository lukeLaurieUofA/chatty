/*
 * This will create a server using express which will
 * be able to take in a post request and store it
 * inside of a datbase using mongoose. It will also
 * support get requests sending back the needed information.
 * Author: Luke Laurie
 * Date: 2/02/2023
 */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const ChatMessage = require("./Message.js");

// connects to the database
mongoose.connect('mongodb://127.0.0.1:27017/chatty');


app.use(express.static("public_html"));

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at the url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("/chats", (req, res) => {
  // send back all of the messages in the db
  ChatMessage.find({})
    .then(data => {
      // sorts the data based on time sent in
      const sortedData = data.sort((a, b) => {
        return a.time.getTime() - b.time.getTime();
      });
      res.send(sortedData);
    })
    .catch(err => {
      console.log("why");
    })
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url. It will
 * store the information in a database.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/chats/post", (req, res) => {
  // save to db with timestamp
  const curAlias = req.body.alias;
  const curMessage = req.body.message;
  ChatMessage.create({
    time: new Date(),
    alias: curAlias,
    message: curMessage
  })
  .then(data => {
    res.send("success");
  })
  .catch(err => {
    res.send(err);
  });
});

/*
 * This is the code that gets ran whenever the client
 * makes a post request to the server at the url. It will
 * delete all of the values in the database
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.post("/chats/delete", (req, res) => {
  // deletes all data
  ChatMessage.deleteMany({})
    .then(data => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    })
});

/*
 * This is the code that gets ran whenever the client
 * makes a get request to the server at any url.
 * @param {Object} req is the information about the request.
 * @param {Object} res the responce sent back to the user.
 */
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public_html/index.html");
});

/*
 * This is the code that gets ran whenever the server is
 * being started up.
 */
app.listen(80, () => {
  console.log("server listening in port 80");
});
