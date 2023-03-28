import { useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";

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

  const handleAdd = (result) => {
    const newVisitedPlaces = [...visitedPlaces, result];
    setVisitedPlaces(newVisitedPlaces);
    setSearchResults([]);
    setPlace("");
    // Call API to save the new visited place to the database
    // Here, you would replace "YOUR_API_ENDPOINT" with your own backend API endpoint
    fetch("/api/visited-places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: result.name, location: result.location }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
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
            <li key={result._id}>
              <Button onClick={() => handleAdd(result)}>{result.features__properties__name}</Button>
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
            <li key={place._id}>{place.features__properties__name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VisitedPlaces;
