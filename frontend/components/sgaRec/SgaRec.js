import React, { useEffect, useState } from "react";

const SgaRec = () => {
  console.log("it was here");
  const [rec, setRec] = useState([]);
  
  useEffect(() => {
    const fetchRec = async () => {
      try {
        const parsedObject = JSON.parse(localStorage.getItem("jwt"));
        const userid = parsedObject.user._id;

        const response = await fetch(`http://localhost:5000/sga?userid=${userid}`);
        const data = await response.json();
        setRec(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRec();
  }, []);

  return <div>Recommended friends for the trip</div>;
};

export default SgaRec;