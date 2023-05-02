import React from "react";
import AlignItemsList from "@/components/chat/AlignItemsList";
import ChatWindow from "@/components/chat/ChatWindow";

const Trips = () => {
  return (
    <div id="chat">
      <div id="chat-left">
        <AlignItemsList
          chats={["Adwait Kulkarni", "Naruto Uzumaki", "Sasuke Uchiha"]}
        />
      </div>
      <div id="chat-right">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Trips;
