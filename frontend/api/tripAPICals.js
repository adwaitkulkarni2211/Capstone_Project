import { API } from "./API";

export const getMyTrips = async () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  return fetch(`${API}/trip/${jwt.user._id}/getMyTrips`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("GETMYTRIPS ERROR: ", error);
    });
};

export const storeMessage = async (data) => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  return fetch(`${API}/trip/${jwt.user._id}/storeMessage`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt.token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.log("STORE MESSAGE ERROR:", error);
    });
};
