import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";

const CfRec = (props) => {
  const [rec, setRec] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const getRec = () => {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`http://127.0.0.1:5000/cf?location=${props.name}`, requestOptions)
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
    };

    if (rec.length > 0) {
      fetchData();
    }
  }, [rec]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div>People who visited {props.name} also visited</div>
      {data.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
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
            <Button size="small">Learn More</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CfRec;
