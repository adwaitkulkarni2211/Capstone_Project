import React from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

const ChatWindow = () => {
  const messages = [
    "Hey!",
    "Hello!",
    "How are you?",
    "I'm fine. How are you?",
    "I'm great!",
    "What have you been up to?",
    "Enjoying life! What about you?",
    "Me too!",
  ];
  return (
    <div id="chat-window">
      <div id="messages">
        {messages.map((msg) => (
          <>
            <div className="msg">
              <Typography variant="h10">{msg}</Typography>
            </div>
            <Divider />
          </>
        ))}
      </div>
      <div id="input-send">
        <TextField fullWidth label="fullWidth" id="fullWidth" />
        <Button variant="contained">Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
