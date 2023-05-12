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
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";

const dashboard = () => {
  let userid = 1;
  // const parsedObject = JSON.parse(localStorage.jwt);
  // const userid = parsedObject.user._id;
  // console.log(userid);
  const [rec, setRec] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let parsedObject = localStorage.getItem("jwt");
    parsedObject = JSON.parse(parsedObject);
    userid = parsedObject.user._id;
    // console.log(parsedObject.user._id);
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
      setData((prevData) => [
        ...prevData,
        ...newData.filter(
          (item) =>
            !prevData.some((prevItem) => prevItem.placeId === item.placeId)
        ),
      ]);
      setLoading(false);
    };

    if (rec.length > 0) {
      fetchData();
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 8000);
    }
  }, [rec]);

  const router = useRouter();

  // const handleSignout = () => {
  //   signout(() => {
  //     router.push("/signin");
  //   });
  // };
  function handleLearnMoreClick(e, item) {
    e.preventDefault();
    const url = `/place?id=${item.placeData.features__id}&name=${item.placeData.features__properties__name}&kinds=${item.placeData.features__properties__kinds}&coordinate1=${item.placeData.features__geometry__coordinates__001}&coordinate2=${item.placeData.features__geometry__coordinates__002}`;
    window.open(url, "_blank");
  }

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress style={{ textAlign: "center", margin: "0 auto" }} />
          <Typography variant="h6" style={{ marginTop: "10px" }}>
            Loading Places...{" "}
          </Typography>
        </Box>
      ) : (
        <div>
          <div style={{ marginBottom: "40px" }}>
            <Navbar />
          </div>
          {/* <Button variant="contained" onClick={handleSignout}>
            Sign Out
          </Button> */}
          {console.log(data.length)}
          {/* {data.length === 0 && (
            <h1>
              <Typography>
                Please add some data through{" "}
                <Link href="/visitedplaces">visited places</Link>
              </Typography>
            </h1>
          )} */}
          <div
            style={{
              paddingRight: "15px",
              paddingLeft: "15px",
              borderRadius: "8px",
              marginTop: "100px",
              marginLeft: "40px",
            }}
          >
            <Box style={{ marginTop: "20px", marginBottom: "20px" }}>
              <Grid container spacing={2}>
                {data.map((item, index) => (
                  <Grid item spacing={2} key={index}>
                    {/* {console.log(item)} */}
                    <Card
                      variant="outlined"
                      style={{
                        height: 250,
                        width: 300,
                        boxShadow: "0 0.6rem 1.2rem rgba(0, 0, 0, 0.075)",
                      }}
                      className="card-content"
                    >
                      {" "}
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {item.placeData.features__properties__name}
                        </Typography>

                        {/* <Chip label={item.placeData.features__properties__kinds} color="success" size="small"/> */}
                        <div className="tags">
                          {item.placeData.features__properties__kinds
                            .split(",")
                            .map((kinds) => {
                              // Check if kinds equals "interesting_places"
                              if (kinds === "interesting_places") {
                                return null; // Return null to skip rendering
                              }
                              return (
                                <Chip
                                  label={kinds}
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                />
                              );
                            })}
                        </div>
                      </CardContent>
                      <CardActions>
                        {/* <Link
                          href={{
                            pathname: "/place",
                            query: {
                              id: item.placeData.features__id,
                              name: item.placeData.features__properties__name,
                              kinds: item.placeData.features__properties__kinds,
                              coordinate1:
                                item.placeData
                                  .features__geometry__coordinates__001,
                              coordinate2:
                                item.placeData
                                  .features__geometry__coordinates__002,
                            },
                          }}
                          passHref
                        >
                          <a target="_blank">
                            <Button size="small">Learn More</Button>
                          </a>
                        </Link> */}
                        <Button
                          size="small"
                          onClick={(e) => handleLearnMoreClick(e, item)}
                          className="explore-btn"
                        >
                          Explore
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

const getPlaceData = (id) => {};

export default checkAuth(dashboard);
