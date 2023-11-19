import waitingUsers from '../models/user.js';
import * as userController from './userController.js';
import * as pcController from './pairedConnectionController.js';
import PairedConnections from '../models/pairedConnections.js'; 

var sockets={}


export function newConnectionCreated(socket,clientId){

  sendTo(socket,{type:"cliendId",clientId:clientId});
  sockets[clientId]=socket;

}



export async function handleInterviewerJoin(socket, clientId,offer){

  const userData={
    clientId:clientId,
    offer:offer
  }

  try {
    const newWaitingUser = new waitingUsers(userData);
    await newWaitingUser.save();
    console.log('User saved successfully:');
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate key error: User already exists.');
    } else {
      console.error('Error occurred while saving:', error);
    }
  }
}
export async function handleIntervieweeJoin(socket, clientId){
  try {
    sockets[clientId]=socket;
    const interviewer=await userController.getRandomUser();
    if(interviewer){
      const pairedClientId=interviewer.clientId;
      sendTo(socket,{type:"server_offer",cliendId:pairedClientId,offer:interviewer.offer});

      //Saveing the pair to database.
      const newPair = new PairedConnections({
        user1: String(clientId),
        user2: String(pairedClientId),
      });

      await newPair.save()
      .then((savedPairing) => {
        console.log('Pairing saved successfully:');
      })
      .catch((error) => {
        console.error('Error saving pairing:', error);
      });
    }
    else{
      console.log("No user is currently available.")
    }
    
  } catch (error) {
    console.log(error.message);
  }
  
}
export function handleIntervieweeAnswer(clientId, answer){
  try{
    const socket=getUserSocket(clientId);
    sendTo(socket,{type:"server_answer",answer:answer});
    userController.deleteUserById(clientId);
  } catch(err){
    console.log(err.message);
  }
}

export function handleIceCandidateExchange(clientId,candidate){
  const socket=getUserSocket(clientId);
  sendTo(socket,{type:"set_candidate",candidate:candidate});
}

export function handleUserLeave(clientId){
  const socket=getUserSocket(clientId);
  sendTo(socket,{type:"server_userwanttoleave"});
  pcController.deletePairByClientId(clientId);
}

export async function handleUserDisconnected(clientId,isOnCall){
  try{
    if(isOnCall){
    const pairedUserID=await pcController.getOtherUserId(clientId);
    await handleUserLeave(pairedUserID);
    }
    if (clientId in sockets) {
      delete sockets[clientId];
    }
  } catch (error) {
    console.log(error.message);
  }

}


// helping functions

function getUserSocket(clientId){
  return sockets[clientId];
}
function sendTo(conn, message) {
  try{
    if(conn){
	    conn.send(JSON.stringify(message));
    }
  } catch(error){
    console.log(error.message);
  }
}
