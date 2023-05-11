import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import ErrorMessage from "../messages/ErrorMessage";
import { format } from "date-fns";

const ChatWindow = ({
  setCurrentMessage,
  currentMessage,
  sendMessage,
  allMessages,
}) => {
  const sendRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendRef.current.click();
    }
  };
  return (
    <div id="chat-window">
      <div id="messages">
        <Divider />
        {allMessages.length > 0 ? (
          allMessages.map((msg, idx) => (
            <div className="msg" key={idx}>
              <div className="msg-content">{msg.content}</div>
              <div className="msg-details">
                <div className="msg-sender">{msg.sender}</div>
                <div className="msg-time">
                  {format(new Date(msg.time), "HH:mm:ss a")}
                </div>
              </div>
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
          label="Type Message"
          autoComplete="off"
          id="input-field"
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          value={currentMessage}
        />
        <Button
          variant="contained"
          id="send-btn"
          onClick={sendMessage}
          ref={sendRef}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
