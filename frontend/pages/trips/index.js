import React, { useEffect, useState } from "react";
import AlignItemsList from "@/components/trips/AlignItemsList";
import ChatWindow from "@/components/trips/ChatWindow";
import { getMyTrips } from "../../api/tripAPICals";

const Trips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({});

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
  }, [currentTrip]);

  return (
    <div id="chat">
      <div id="chat-left">
        <AlignItemsList chats={myTrips} setCurrentTrip={setCurrentTrip} />
      </div>
      <div id="chat-right">
        <ChatWindow currentTrip={currentTrip} />
      </div>
    </div>
  );
};

export default Trips;
