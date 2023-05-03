import { useState } from "react";
import { TextField, Button, Typography, Link } from "@material-ui/core";
import { authenticate, signin } from "../../api/authAPICalls";
import { useRouter } from "next/router";
import ErrorMessage from "../../components/messages/ErrorMessage";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          authenticate(data, () => {
            router.push("/dashboard");
          });
        }
      })
      .catch(console.log("SIGN IN REQUEST FAILED."));
  };

  const SigninForm = () => {
    return (
      <div className="login-page">
        <form onSubmit={handleSubmit} className="login-form">
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
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
            Sign In
          </Button>
          <Typography variant="body2" style={{ marginTop: "16px" }}>
            Don't have an Account?{" "}
            <Link href="/signup" color="primary">
              Sign Up Here
            </Link>
          </Typography>
        </form>
      </div>
    );
  };

  return (
    <>
      {SigninForm()}
      <ErrorMessage message={error} />
    </>
  );
};

export default Signin;
