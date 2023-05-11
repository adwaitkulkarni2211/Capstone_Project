import React, { useEffect, useState } from "react";
import AlignItemsList from "@/components/trips/AlignItemsList";
import ChatWindow from "@/components/trips/ChatWindow";
import { getMyTrips, storeMessage } from "../../api/tripAPICals";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

const Trips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({});
  const [currentMessage, setCurrentMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //API call to get all Trips
  useEffect(() => {
    getMyTrips()
      .then((data) => {
        if (data.error) {
          console.log("error:", error);
        }
        setMyTrips([...data.myTrips]);
      })
      .catch(() => console.log("ERROR IN GETMYTRIPS"));
  }, []);

  useEffect(() => {
    const joinRoom = async () => {
      if (currentTrip._id !== undefined) {
        await socket.emit("join_room", JSON.stringify(currentTrip._id));
      }
    };
    joinRoom();

    if (currentTrip.messages !== undefined) {
      setAllMessages(currentTrip.messages);
    }
  }, [currentTrip]);

  const sendMessage = async () => {
    if (currentMessage === "") {
      return;
    }
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const messageData = {
      sender: jwt.user.name,
      time: new Date().toISOString(),
      content: currentMessage,
      room: currentTrip._id,
    };

    await socket.emit("to_backend", messageData);
    setAllMessages((messageList) => [...messageList, messageData]);

    //save message to database
    const messageDataToSend = {
      tripid: currentTrip._id,
      newMessage: messageData,
    };
    storeMessage(messageDataToSend)
      .then((data) => {
        if (data.error) {
          console.log("error:", error);
        }
      })
      .catch(() => console.log("ERROR IN STOREMESSAGE"));

    setCurrentMessage("");
  };

  useEffect(() => {
    // This useEffect hook sets up the event listener for receiving messages from the server
    socket.on("from_backend", (data) => {
      setAllMessages((messageList) => [...messageList, data]);
    });

    // Return a cleanup function that removes the event listener when the component unmounts
    return () => {
      socket.off("from_backend");
    };
  }, []);

  return (
    <div id="chat">
      <div id="chat-left">
        <AlignItemsList chats={myTrips} setCurrentTrip={setCurrentTrip} />
      </div>
      <div id="chat-right">
        <ChatWindow
          setCurrentMessage={setCurrentMessage}
          currentMessage={currentMessage}
          sendMessage={sendMessage}
          allMessages={allMessages}
        />
      </div>
    </div>
  );
};

export default Trips;
