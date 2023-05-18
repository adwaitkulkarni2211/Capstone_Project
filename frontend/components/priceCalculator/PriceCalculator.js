import React, { useEffect, useState } from "react";
const pricePerKm = 2; // Updated price per km
let jwt = "";

if (typeof window !== "undefined") {
  jwt = JSON.parse(localStorage.getItem("jwt"));
}

const PriceCalculator = (props) => {
  const [results, setResults] = useState({ lat: 0, long: 0 });
  const [price, setPrice] = useState(0);
  const [distance, setDistance] = useState(0);
  function calculateDistance(startLat, startLng, endLat, endLng) {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(endLat - startLat);
    const dLng = toRadians(endLng - startLng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(startLat)) *
        Math.cos(toRadians(endLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    setDistance(R * c);
  }
  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  function getPrice(distance) {
    setPrice(distance * pricePerKm);
  }
  useEffect(() => {
    const searchPeople = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${jwt.token}`);

      var raw = JSON.stringify({
        name: `${jwt.user.name}`,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `http://localhost:3000/api/user/${jwt.user._id}/getUsersByName`,
          requestOptions
        );
        const result = await response.json();
        // setResults(result.users);
        // console.log("the user location is: " + result.users[0].location);
        const { location } = result.users[0];
        setResults(location);
        console.log("the user location is: " + location);
      } catch (error) {
        console.log("error", error);
      }
    };

    searchPeople();
  }, []);
  // const startLat = 40.712783;
  // const startLng = -74.005941;
  setTimeout(() => {
    calculateDistance(results.lat, results.long, props.lat, props.long);
    getPrice(distance);
  }, 500);

  return (
    <div>
      The price is: Rs.{price.toFixed(0)},for a distance of:{" "}
      {distance.toFixed(0)} km
    </div>
  );
};

export default PriceCalculator;
