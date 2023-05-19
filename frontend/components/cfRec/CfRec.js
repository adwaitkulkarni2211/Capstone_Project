import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

const CfRec = (props) => {
  const python=process.env.NEXT_PUBLIC_Flask_API
  const [rec, setRec] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const getRec = () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${python}/cf?location=${props.name}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setRec(result);
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    };
    getRec();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const newData = [];
      for (const place of rec) {
        const response = await fetch(
          `${python}/place/${place.placeId}`
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
    };

    if (rec.length > 0) {
      fetchData();
    }
  }, [rec]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        People who visited {props.name} also visited
      </div>
      <Grid container spacing={3}>
        {data.map((item, index) => (
          <Grid item spacing={2} key={index}>
            <Card
              key={index}
              style={{
                border: "1px solid black",
                padding: "10px",
                marginBottom: "10px",
                boxShadow: "0 0.6rem 1.2rem rgba(0, 0, 0, 0.075)",
              }}
            >
              <div>{item.placeData.features__properties__name}</div>
              <Link
                href={{
                  pathname: "/place",
                  query: {
                    id: item.placeData.features__id,
                    name: item.placeData.features__properties__name,
                    kinds: item.placeData.features__properties__kinds,
                    coordinate1:
                      item.placeData.features__geometry__coordinates__001,
                    coordinate2:
                      item.placeData.features__geometry__coordinates__002,
                  },
                }}
              >
                <Button size="small">Explore</Button>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CfRec;
