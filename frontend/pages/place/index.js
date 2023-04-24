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
  const { id } = router.query;
  const { name, kinds, coordinate1, coordinate2 } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=true&exintro=true&generator=geosearch&ggscoord=${coordinate2}|${coordinate1}`
      );
      const placeData = await response.json();
      setPlaceDescription(placeData);
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
      {placeDescription ? (
        <p>Description:{placeDescription}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default place_description;
