import React, { useEffect, useState } from "react";
import AlignItemsList from "@/components/trips/AlignItemsList";
import ChatWindow from "@/components/trips/ChatWindow";
import { getMyTrips } from "../../api/tripAPICals";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

const Trips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({});
  const [currentMessage, setCurretMessage] = useState("");
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
    console.log("CURRENT TRIP", currentTrip);
    const joinRoom = async () => {
      if (currentTrip._id !== undefined) {
        await socket.emit("join_room", JSON.stringify(currentTrip._id));
      }
    };
    joinRoom();
  }, [currentTrip]);

  const sendMessage = async () => {
    const jwt = JSON.parse(localStorage.getItem("jwt"));
    const messageData = {
      sender: jwt.user._id,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      content: currentMessage,
      room: currentTrip._id,
    };

    await socket.emit("to_backend", messageData);
    setAllMessages((messageList) => [...messageList, messageData]);
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

  useEffect(() => {
    console.log("ALL MESSAGES: ", allMessages);
  }, [allMessages]);

  return (
    <div id="chat">
      <div id="chat-left">
        <AlignItemsList chats={myTrips} setCurrentTrip={setCurrentTrip} />
      </div>
      <div id="chat-right">
        <ChatWindow
          setCurrentMessage={setCurretMessage}
          sendMessage={sendMessage}
          allMessages={allMessages}
        />
      </div>
    </div>
  );
};

export default Trips;
