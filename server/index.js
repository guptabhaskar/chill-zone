const express = require("express");
const cors = require("cors");
const server = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
var meetingRouter = require('./routes/meetingRouter');

const app = express();
const serve = server.Server(app);

// Connecting socket to server with cors policy
const io = socketIO(serve, {
  cors: {
    origins: ["*"],
    handlePreflightRequest: (req, res) => {
      const headers = {
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      };
      res.writeHead(200, headers);
      res.end();
    },
  },
});

// get port and database connection url
const CONNECTION_URL = process.env.CONNECTION_URL;
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// API Routes
app.use('/', meetingRouter);

// Socket connection
io.on('connection', socket => {
  console.log('Socket Established')
  socket.on('join-room', (userData) => {
    const { roomID, userID } = userData;
    socket.join(roomID); // Connect socket to roomID
    socket.on('broadcast-message', (message) => { // Broadcast message to other websockets on same roomID
      socket.to(roomID).emit('new-broadcast-messsage', message);
    });
    if (userID !== 'NA') {
      socket.to(roomID).emit('new-user-connect', userData); // Send peerID to other peers
      socket.on('disconnect', () => {
        socket.to(roomID).emit('user-disconnected', userID); // Emit user-disconnected to other peers
      });
      socket.on('display-off', (SharedScreenID) => { // Emit display-off to other peers
        socket.to(roomID).emit('user-disconnected', SharedScreenID);
      });
      socket.on('hand-raised', (handRaisedData) => { // Emit hand-raise feature to other peers
        socket.to(roomID).emit('new-hand-raise', handRaisedData);
      });
    }
  });
});

// Connect to Database
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};
const connect = mongoose.connect(CONNECTION_URL, options);
connect.then(() => {
  console.log("Connected correctly to server");
  console.log("Connection to db successful");
}, (err) => {
  console.log("Unable to connect to the db. error: " + err);
});

// Server listen initialized
serve
  .listen(port, () => {
    console.log(`Listening on the port ${port}`);
  })
  .on("error", (e) => {
    console.error(e);
  });