import { useState, useEffect } from "react";
import { TextField, Button, Typography, Link } from "@material-ui/core";
import { signup } from "../../api/authAPICalls";
import ErrorMessage from "../../components/messages/ErrorMessage";
import SuccessMessage from "@/components/messages/SuccessMessage";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState({});

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({ name, email, password, location })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setSuccess(false);
        } else {
          setSuccess("You have signed up successfully!");
        }
      })
      .catch(console.log("ERR IN SIGNUP"));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const { longitude: long, latitude: lat } = position.coords;
        setLocation({ lat, long });
      });
    } else {
      console.log("No location found");
    }
  }, []);

  const SignupForm = () => {
    return (
      <div className="signup-page">
        <form onSubmit={handleSubmit} className="signup-form">
          <Typography variant="h5" gutterBottom>
            Sign Up
          </Typography>
          <TextField
            label="Name"
            variant="standard"
            fullWidth
            margin="normal"
            value={name}
            onChange={handleNameChange}
            className="form-input"
          />
          <TextField
            label="Email"
            variant="standard"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
            className="form-input"
          />
          <TextField
            label="Password"
            type="password"
            variant="standard"
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            className="form-input"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px", backgroundColor: "#004f8c" }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" style={{ marginTop: "16px" }}>
            Already have an account?{" "}
            <Link href="/signin" color="primary">
              Login instead
            </Link>
          </Typography>
        </form>
      </div>
    );
  };

  return (
    <>
      {SignupForm()}
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
    </>
  );
};

export default Signup;
