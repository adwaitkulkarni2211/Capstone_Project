import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

const SgaRec = () => {
  const [rec, setRec] = useState([]);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const parsedObject = JSON.parse(localStorage.getItem("jwt"));
        const userid = parsedObject.user._id;

        const response = await fetch(`http://localhost:5000/sga?userid=${userid}`);
        const data = await response.json();
        console.log("data is : ",data);
        setRec(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRec();
  }, []);

  return (<div>
    <div>Recommended friends for the trip</div>
    <Grid container spacing={3}>
        {rec.map((item, index) => (
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
              <div>{item.name}</div>
              <Link
                
                href={{
                  pathname: "#",
                }}
              >
                <Button size="small">{item.email}</Button>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
};

export default SgaRec;