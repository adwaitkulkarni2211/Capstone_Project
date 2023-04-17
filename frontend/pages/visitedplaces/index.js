import { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import checkAuth from "@/components/checkAuth/checkAuth";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MultipleSelectChip from "@/components/mui_components/MultipleSelectChips";

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
    const newVisitedPlaces = [
      ...visitedPlaces,
      { place: place, rating: rating, tags: tags },
    ];
    setVisitedPlaces(newVisitedPlaces);
    // setSearchResults([]);
    // setPlace("");
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
    console.log("tempvisitedplaces: ", tempVisitedPlaces);
    let history = { history: tempVisitedPlaces };
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
      console.log("Error saving places to db: ", error);
    }
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
      {visitedPlaces.length > 0 && (
        <ul className="visited-places-list">
          {visitedPlaces.map((place) => (
            <li key={place.features__id}>
              {place.place.features__properties__name} {place.rating}{" "}
              {JSON.stringify(place.tags)}
            </li>
          ))}
        </ul>
      )}
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Places
      </Button>
    </div>
  );
};

export default checkAuth(VisitedPlaces);
