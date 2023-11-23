import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from "openai";


dotenv.config();
const openai = new OpenAI();
const app = express();

// // Middleware
app.use(bodyParser.json());
openai.apiKey=process.env.OPENAI_API_KEY;

// Handle POST requests
app.post('/api/aimockinterview', async (req, res) => {
  const clientMessages = req.body.messages;

  const serverReply=await getOpenaiResponse(clientMessages);

  // Send a response

  res.json({ message: serverReply});
});

async function getOpenaiResponse(messages) {
  try{
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0];
  }catch(err){
    console.log(err.message);
  }
}

export default app;