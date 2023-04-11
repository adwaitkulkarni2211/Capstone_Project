// import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const dashboard = () => {
  const userid = 1;
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = () => {
      fetch(`http://localhost:5000/cbr?userid=${userid}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
        })
        .catch((e) => console.log(e));
    };
    fetchData();
  }, [userid]);
  return (
    <>
      {data.map((place) => (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            {" "}
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Your recommendations
              </Typography>
              <Typography variant="h5" component="div">
                {place.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
                {getPlaceData(place.placeId)}
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Box>
      ))}
    </>
  );
};

const getPlaceData = (id) => {
  
};

export default dashboard;
