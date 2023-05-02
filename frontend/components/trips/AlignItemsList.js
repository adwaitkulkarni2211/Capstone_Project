import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

export default function ListDividers({ chats, setCurrentTrip }) {
  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      {chats.map((chat, idx) => (
        <div key={idx}>
          <ListItem button onClick={() => setCurrentTrip(chat)}>
            <ListItemText primary={chat.name} />
          </ListItem>
          <Divider />
        </div>
      ))}
    </List>
  );
}
