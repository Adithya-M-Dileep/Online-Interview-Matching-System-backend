import http from 'http';
import { WebSocketServer } from 'ws';
import app from "./src/app.js";
import connectDB from './config/db.js';
import * as socketHandlers from './src/services/socketHandlers.js';

// connect to DB
try{
  connectDB();
}catch(err){
  console.log(err.message);
}

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  console.log('User connected:');

  const clientId= generateUniqueId();
  socket.clientId=clientId;
  socket.onCall=false;

  // send the user's id back as a welcome message
  socketHandlers.newConnectionCreated(socket,clientId);

  socket.on('message', (message) => {

    const data = JSON.parse(message);
    // console.log('Received message:', data);
    switch (data.type) {
      case 'interviewer_join':
        socketHandlers.handleInterviewerJoin(socket, data.clientId,data.offer);
        break;
      case 'interviewee_join':
        socketHandlers.handleIntervieweeJoin(socket, data.clientId);
        break;
      case 'interviewee_answer':
        socketHandlers.handleIntervieweeAnswer(data.clientId, data.answer);
        break;
      case 'candidate_exchange':
        socketHandlers.handleIceCandidateExchange(data.clientId,data.candidate);
        socket.onCall=true;
        break;
      case 'userwanttoleave':
        socketHandlers.handleUserLeave(data.clientId);
        socket.onCall=false;
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  });

  socket.on('close', () => {
    console.log('User disconnected');
    socketHandlers.handleUserDisconnected(socket.clientId,socket.onCall);
  });
});

// handle ID generation
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${server.address().port}`);
});
