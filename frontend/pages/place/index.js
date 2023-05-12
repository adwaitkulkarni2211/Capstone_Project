import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import checkAuth from "@/components/checkAuth/checkAuth";
import { signout } from "@/api/authAPICalls";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import TextField from "@mui/material/TextField";
import SuccessMessage from "@/components/messages/SuccessMessage";
import CfRec from "@/components/cfRec/CfRec";
import Navbar from "@/components/navbar/navbar";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const steps = [
  {
    label: "Add People",
    description: `Add people to go to a trip with`,
  },
  {
    label: "Select a trip name",
    description: "Add a interesting name or title to your trip",
  },
  {
    label: "Done !!",
    description: `See all your changes and confirm`,
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const place_description = () => {
  let jwt = "";

  if (typeof window !== "undefined") {
    jwt = JSON.parse(localStorage.getItem("jwt"));
  }
  const [loading, setLoading] = useState(true);
  const [placeDescription, setPlaceDescription] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [search, setSearch] = useState();
  const [results, setResults] = useState();
  const [addedUser, setAddedUser] = useState({});
  const [omg, setOmg] = useState();
  const [title, setTitle] = useState();
  const [success, setSuccess] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    // setSuccess(false);
  };
  const handleOmg = (e) => setOmg(e.target.value);
  const handleNameChange = () => {
    setTitle(omg);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter();
  console.log(router.query);
  const { id } = router.query;
  const { name, kinds } = router.query;
  const { coordinate2, coordinate1 } = router.query;
  // console.log(coordinate1, coordinate2);
  var place_name = name;
  var requestBody = {
    latitude: coordinate1,
    longitude: coordinate2,
  };

  console.log(requestBody);
  useEffect(() => {
    const fetchData = async () => {
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
      let place_description;
      if (placeData.hasOwnProperty("query") === false) {
        place_description = "No description available";
      } else {
        const page = Object.values(placeData.query.pages).filter(
          (place) => name.includes(place.title) || place.title.includes(name)
        );
        console.log(page);
        place_description = page[0]?.extract ?? "No description available";
        console.log(place_description);

        setLoading(false);
      }
      setPlaceDescription(place_description);
    };
    fetchData();
  }, [coordinate2, coordinate1]);
  const searchPeople = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${jwt.token}`);

    var raw = JSON.stringify({
      name: `${search}`,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/${jwt.user._id}/getUsersByName`,
        requestOptions
      );
      const result = await response.json();
      setResults(result.users);
      console.log(result);
    } catch (error) {
      console.log("error", error);
    }
  };
  const addPeople = (name, email, _id) => {
    // setAddedUser([...addedUser, [name,email,_id]]);
    setAddedUser((prevState) => ({
      ...prevState,
      [_id]: { name, email, _id },
    }));
    // setSuccess("Successfully added");
  };
  const handleSubmit = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${jwt.token}`);

    var raw = JSON.stringify({
      name: `${title}`,
      members: Object.keys(addedUser),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/api/trip/${jwt.user._id}/${id}/createTrip`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setSuccess("Data Saved");
      })
      .catch((error) => console.log("error", error));
  };
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
            Loading...{" "}
          </Typography>
        </Box>
      ) : (
        <div>
          <div style={{ marginBottom: "40px" }}>
            <Navbar />
          </div>
          <div className="container">
            <div className="desc-container">
              <div className="place-img">
                <img
                  src="data:image/jpeg;base64,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"
                  height={400}
                  width={500}
                ></img>
              </div>
              <div>
                <h1>{name}</h1>
                <div className="tags">
                  {kinds.split(",").map((kinds) => {
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
                <p style={{ padding: "10px", lineHeight: 1.8 }}>
                  {placeDescription}
                </p>
                <Button
                  size="medium"
                  onClick={handleOpen}
                  variant="contained"
                  style={{ marginLeft: "10px" }}
                >
                  Create trip
                </Button>
              </div>
            </div>
            <div className="other-places">
              <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
              >
                <Box sx={style}>
                  <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          optional={
                            index === 2 ? (
                              <Typography variant="caption">
                                Last step
                              </Typography>
                            ) : null
                          }
                        >
                          {step.label}
                        </StepLabel>
                        <StepContent>
                          <Typography>{step.description}</Typography>
                          {index === 0 && (
                            <div>
                              <Typography>Search People</Typography>
                              <TextField
                                id="outlined-basic"
                                label="search"
                                variant="outlined"
                                size="small"
                                onChange={handleSearchChange}
                              />
                              <Button onClick={searchPeople}>Search</Button>
                              {results &&
                                results.map(({ name, email, _id }) => (
                                  <div>
                                    <Typography
                                      key={_id}
                                    >{`name: ${name} & email: ${email}`}</Typography>
                                    <Button
                                      onClick={() =>
                                        addPeople(name, email, _id)
                                      }
                                    >
                                      add
                                    </Button>
                                  </div>
                                ))}
                            </div>
                          )}
                          {/* {console.log(addedUser)} */}
                          {index === 1 && (
                            <TextField
                              id="outlined-basic"
                              label="name"
                              variant="outlined"
                              size="small"
                              onChange={handleOmg}
                            />
                          )}
                          {index === 2 && (
                            <div>
                              {Object.entries(addedUser).map(
                                ([id, { name, email }]) => (
                                  <div key={id}>
                                    <Typography>{`name: ${name} & email: ${email}`}</Typography>
                                  </div>
                                )
                              )}
                              <Typography>{title}</Typography>
                            </div>
                          )}
                          <Box sx={{ mb: 2 }}>
                            <div>
                              <Button
                                variant="contained"
                                onClick={
                                  index === 1
                                    ? handleNameChange
                                    : index === 2
                                    ? handleSubmit
                                    : handleNext
                                }
                                sx={{ mt: 1, mr: 1 }}
                              >
                                {index === steps.length - 1
                                  ? "Confirm"
                                  : "Continue"}
                              </Button>
                              <Button
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                              >
                                Back
                              </Button>
                            </div>
                            <SuccessMessage message={success} />
                          </Box>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Modal>
              <CfRec name={name} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default place_description;
