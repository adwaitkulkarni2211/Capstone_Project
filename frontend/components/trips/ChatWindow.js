import React from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import ErrorMessage from "../messages/ErrorMessage";

const ChatWindow = ({ setCurrentMessage, sendMessage, allMessages }) => {
  // const messages = [
  //   "Hey!",
  //   "Hello!",
  //   "How are you?",
  //   "I'm fine. How are you?",
  //   "I'm great!",
  //   "What have you been up to?",
  //   "Enjoying life! What about you?",
  //   "Me too!",
  // ];
  return (
    <div id="chat-window">
      <div id="messages">
        {allMessages.length > 0 ? (
          allMessages.map((msg, idx) => (
            <div className="msg" key={idx}>
              <Typography variant="h10">{msg.content}</Typography>
              <Divider />
            </div>
          ))
        ) : (
          <ErrorMessage message={"NO MESSAGES"} />
        )}
      </div>
      <div id="input-send">
        <TextField
          fullWidth
          label="fullWidth"
          id="fullWidth"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
