const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// create a message
app.use(bodyParser.json());
app.post("/messages", function (req, res) {

  const newMessage = req.body;
  // console.log(Object.values(newMessage));
  // console.log(newMessage.text);

  if(newMessage.from == "" ||  newMessage.text == "") {
    
    res.status(400);
    res.json("Please enter all fields");

  } else {

    newMessage.id = messages.length;

    messages.push(newMessage);

    res.status(201);
    res.json("New message added successfully");
  }
});

// Read all messages
app.get("/messages", function (req, res) {
  res.json(messages);
})

//  [ ] Read _only_ messages whose text contains a given substring: `/messages/search?text=express`
app.get("/messages/search", function (req, res) {
  const {text} = req.query;
  const textFiltered = messages.filter( message => message.text.toLowerCase().includes(text) );
  console.log(textFiltered);
  res.json(textFiltered);
})

//  [ ] Read only the most recent 10 messages: `/messages/latest`
app.get("/messages/latest", function (req,res) {
  if(messages.length > 10) {
    let surplusItems = messages.length - 10;
    let latest = messages.slice(surplusItems);
    res.json(latest);
  } else {
    res.json(messages);
  }
})

// Read one message specified by an ID
app.get("/messages/:id", function (req, res) {
  let {id} = req.params;
  let messageFiltered = messages.filter(message => message.id == id);
  res.json(messageFiltered);
})

// Delete a message, by ID
app.delete("/messages/:id", function (req, res) {
  const {id} = req.params;
  messages.forEach(message => {
    if(message.id == id) {
      messages.splice(id, 1)
    }
  })
  res.json("Message " + id + " deleted");
});

app.listen(process.env.PORT || 3000);
