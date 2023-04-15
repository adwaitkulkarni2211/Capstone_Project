import { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import checkAuth from "@/components/checkAuth/checkAuth";
import FormDialog from "@/components/dialogs/FormDialog";

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

  const handleAdd = (place, rating) => {
    const newVisitedPlaces = [
      ...visitedPlaces,
      { place: place, rating: rating },
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
      return { placeid: item.place.features__id, rating: item.rating };
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
              {/* <Button onClick={() => handleAdd(result)}>
                {result.features__properties__name}
              </Button> */}
              <FormDialog
                openButton={result.features__properties__name}
                title={"Give a Rating"}
                content={"Rate this place from 0 to 5 based on your experience"}
                inputlabel={"Rating"}
                OKButton={"Save"}
                onClickOK={(rating) => handleAdd(result, rating)}
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
              {place.place.features__properties__name} {place.rating}
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
