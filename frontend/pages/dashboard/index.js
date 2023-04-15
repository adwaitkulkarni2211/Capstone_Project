// import React, { useState, useEffect } from 'react';
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
import checkAuth from "@/components/checkAuth/checkAuth";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const dashboard = () => {
  const userid = 1;
  const [rec, setRec] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRec = () => {
      fetch(`http://localhost:5000/cbr?userid=${userid}`)
        .then((res) => res.json())
        .then((data) => {
          setRec(data);
        })
        .catch((e) => console.log(e));
    };
    fetchRec();
  }, [userid]);

  useEffect(() => {
    const fetchData = async () => {
      const newData = [];
      for (const place of rec) {
        const response = await fetch(
          `http://localhost:5000/place/${place.placeId}`
        );
        const placeData = await response.json();
        newData.push({ placeData });
      }
      // setData((prevData) => [...prevData, ...newData]);
      setData((prevData) => [
        ...prevData,
        ...newData.filter(
          (item) =>
            !prevData.some((prevItem) => prevItem.placeId === item.placeId)
        ),
      ]);
    };
    if (rec.length > 0) {
      fetchData();
    }
  }, [rec]);

  return (
    <>
      {console.log(data)}
      <Box sx={{ minWidth: 275 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {data.map((item, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              {/* {console.log(item)} */}
              <Item>
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
                      {item.placeData.features__properties__name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {item.placeData.features__properties__kinds}
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
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

const getPlaceData = (id) => {};

export default checkAuth(dashboard);
