import { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import checkAuth from "@/components/checkAuth/checkAuth";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MultipleSelectChip from "@/components/mui_components/MultipleSelectChips";
import ErrorMessage from "@/components/messages/ErrorMessage";
import SuccessMessage from "@/components/messages/SuccessMessage";
import { Box, Card, CardActions, CardContent, Chip, Grid } from "@mui/material";

function FormDialog({ openButton, onClickOK }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [rating, setRating] = useState("");
  const [tags, setTags] = useState([]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {openButton}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Give a Rating"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Rate this place from 0 to 5 based on your experience"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Rating"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setRating(e.target.value)}
          />
        </DialogContent>
        <DialogContent>
          <DialogContentText>
            {"Select the most appropriate tags to describe the place:"}
          </DialogContentText>
          <MultipleSelectChip
            arr={[
              "nature",
              "trek",
              "religious",
              "historic",
              "themePark",
              "entertainment",
              "architecture",
            ]}
            getSelectedItems={(seletedItems) => {
              setTags(seletedItems);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={(e) => {
              handleClose();
              onClickOK(rating, tags);
            }}
          >
            {"Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const VisitedPlaces = () => {
  const [place, setPlace] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visitedPlaces, setVisitedPlaces] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePlaceChange = (e) => setPlace(e.target.value);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/search/${place}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = (place, rating, tags) => {
    //check if place already exists
    const doesExist = visitedPlaces.find(
      (item) => item.place.features__id === place.features__id
    );
    if (doesExist !== undefined) {
      handleEdit(place, rating, tags);
      return;
    }

    const newVisitedPlaces = [
      ...visitedPlaces,
      { place: place, rating: rating, tags: tags },
    ];
    setVisitedPlaces(newVisitedPlaces);
  };

  const handleEdit = (place, rating, tags) => {
    const tempVisitedPlaces = [...visitedPlaces];

    const placeToEdit = tempVisitedPlaces.find(
      (item) => item.place.features__id === place.features__id
    );
    placeToEdit.rating = rating;
    placeToEdit.tags = tags;

    setVisitedPlaces(tempVisitedPlaces);
  };

  const handleDelete = (place) => {
    const newVisitedPlaces = visitedPlaces.filter(
      (item) => item.place.features__id !== place.features__id
    );
    setVisitedPlaces(newVisitedPlaces);
  };

  let jwt = "";

  if (typeof window !== "undefined") {
    jwt = JSON.parse(localStorage.getItem("jwt"));
  }

  const handleSave = async () => {
    let tempVisitedPlaces = visitedPlaces.map((item) => {
      return {
        placeid: item.place.features__id,
        rating: item.rating,
        tags: item.tags,
      };
    });

    console.log("Starting history api call");
    let history = { history: tempVisitedPlaces };
    //API call to add visited places to user history
    try {
      const response = await fetch(
        `http://localhost:3000/api/user/${jwt.user._id}/addVisitedPlaces`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt.token}`,
          },
          body: JSON.stringify(history),
        }
      );
      console.log(response);
    } catch (error) {
      setError("Error saving places to db");
      console.log("Error saving places to db: ", error);
    }
    console.log("history api call done, now moving on the save ratings");

    //API call to save rating in the ratings collection
    console.log("tempvisitedplaces: ", tempVisitedPlaces);
    tempVisitedPlaces.forEach(async (place) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/rating/${jwt.user._id}/${place.placeid}/saveRating`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt.token}`,
            },
            body: JSON.stringify({
              rating: place.rating,
              tags: place.tags,
            }),
          }
        );
        console.log(response);
        setSuccess("Information saved successfully");
      } catch (error) {
        setError("Error saving rating to db");
        console.log("Error saving rating to db: ", error);
      }
    });

    console.log("save ratings api calls done moving on to place counter");

    // API call to update counter
    // try {
    //   const response = await fetch(
    //     `http://localhost:3000/api/placesCounter/${jwt.user._id}/updatePlacesCounter`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${jwt.token}`,
    //       },
    //       body: JSON.stringify(history),
    //     }
    //   );
    //   console.log(response);
    //   console.log("update places counter api call done");
    // } catch (error) {
    //   setError("Error updating places Counter to db");
    //   console.log("Error updating places Counter to db: ", error);
    // }

    // console.log("update place counter api done.");
  };

  return (
    <div className="visited-places-container">
      <Typography variant="h4" gutterBottom>
        What places have you already visited?
      </Typography>
      <TextField
        label="Place"
        variant="outlined"
        fullWidth
        margin="normal"
        value={place}
        onChange={handlePlaceChange}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
      <Typography variant="h5" gutterBottom>
        Search Results:
      </Typography>
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((result) => (
            <li key={result.features__id}>
              <FormDialog
                openButton={result.features__properties__name}
                onClickOK={(rating, tags) => handleAdd(result, rating, tags)}
              />
            </li>
          ))}
        </ul>
      )}
      <Typography variant="h5" gutterBottom>
        Visited Places:
      </Typography>
      <div
        style={{
          paddingRight: "15px",
          paddingLeft: "15px",
          borderRadius: "8px",
          marginTop: "10px",
          marginLeft: "40px",
        }}
      >
        <Box style={{ marginTop: "20px", marginBottom: "20px" }}>
          <Grid container spacing={2}>
            {visitedPlaces.map((place, index) => (
              <Grid item spacing={2} key={index}>
                <Card
                  variant="outlined"
                  style={{
                    height: 250,
                    width: 300,
                    boxShadow: "0 0.6rem 1.2rem rgba(0, 0, 0, 0.075)",
                  }}
                  className="card-content"
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {place.place.features__properties__name}
                    </Typography>

                    <div className="tags">
                      {place.tags.map((kinds) => {
                        return (
                          <Chip
                            label={kinds}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        );
                      })}
                      <div className="rating" style={{ marginTop: "2.4rem" }}>
                        <Typography variant="h6">
                          Rating: {place.rating}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions>
                    <FormDialog
                      openButton={"Edit"}
                      onClickOK={(rating, tags) =>
                        handleEdit(place.place, rating, tags)
                      }
                    />
                    <Button
                      variant="outlined"
                      style={{ marginLeft: "1rem" }}
                      onClick={() => handleDelete(place.place)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Places
      </Button>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
    </div>
  );
};

export default checkAuth(VisitedPlaces);
