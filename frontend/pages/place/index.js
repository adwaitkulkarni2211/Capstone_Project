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
  const [images, setImages] = useState([]);
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
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      } else {
        const page = Object.values(placeData.query.pages).filter(
          (place) => name.includes(place.title) || place.title.includes(name)
        );
        console.log(page);
        place_description = page[0]?.extract ?? "No description available";
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
      console.log(place_description);
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
  useEffect(() => {
    async function fetchImages() {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${name}&client_id=XM44am2p3ATTrgzI9rcuhy2EaRPp_2qoVbQOJ4rXjM4&w=500&h=500`
      );
      const data = await response.json();

      const img_url = data.results[0].urls.full;
      console.log(img_url);

      setImages(img_url);
    }

    fetchImages();
  }, [name]);
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
                <div>
                  <img
                    src={images}
                    alt="place-image"
                    height={500}
                    width={500}
                  />
                </div>
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
