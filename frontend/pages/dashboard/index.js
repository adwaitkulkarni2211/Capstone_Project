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
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import checkAuth from "@/components/checkAuth/checkAuth";
import { signout } from "@/api/authAPICalls";
import { useRouter } from "next/router";

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

  const router = useRouter();

  const handleSignout = () => {
    signout(() => {
      router.push("/signin");
    });
  };

  return (
    <>
      <Button variant="contained" onClick={handleSignout}>
        Sign Out
      </Button>
      {/* {console.log(data)} */}
      <div style={{ paddingRight: "15rem", paddingLeft: "15rem" }}>
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
                      <Typography variant="h5" component="div">
                        {item.placeData.features__properties__name}
                      </Typography>
                      <Stack spacing={1} alignItems="center">
                        <Stack direction="row" spacing={1}>
                          {/* <Chip label={item.placeData.features__properties__kinds} color="success" size="small"/> */}
                          {item.placeData.features__properties__kinds
                            .split(",")
                            .map((kinds) => (
                              <Chip
                                label={kinds}
                                color="success"
                                size="small"
                              />
                            ))}
                        </Stack>
                      </Stack>
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
      </div>
    </>
  );
};

const getPlaceData = (id) => {};

export default checkAuth(dashboard);
