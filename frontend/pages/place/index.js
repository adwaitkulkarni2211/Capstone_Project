import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import checkAuth from "@/components/checkAuth/checkAuth";
import { signout } from "@/api/authAPICalls";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const place_description = () => {
  const [placeDescription, setPlaceDescription] = useState(null);
  const router = useRouter();
  // console.log(router.query);
  const { id } = router.query;
  const { name, kinds } = router.query;
  const { coordinate2, coordinate1 } = router.query;
  // console.log(coordinate1, coordinate2);
  var requestBody = {
    latitude: coordinate1,
    longitude: coordinate2,
  };
  console.log(requestBody);
  useEffect(() => {
    const fetchData = async () => {
      if (coordinate1 && coordinate2) {
        // console.log(requestBody);
        const response = await fetch(
          `http://localhost:5000/test?lat=${coordinate2}&long=${coordinate1}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lat: coordinate2,
              long: coordinate1,
            }),
          }
        );
        const placeData = await response.json();
        console.log(placeData);
        setPlaceDescription(placeData);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Place description</h1>
      <p>ID:{id}</p>
      <p>Name:{name}</p>
      <p>Kinds:{kinds}</p>
      <p>C1:{coordinate1}</p>
      <p>C2:{coordinate2}</p>
      {/* <div>
        {placeDescription.map((place) => (
          <div key={place.pageid}>
            <h2>{place.title}</h2>
            <p>{place.extract}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};
export default place_description;
