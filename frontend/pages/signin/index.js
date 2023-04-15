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
      <form onSubmit={handleSubmit} className="signup-form">
        <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
        <Typography variant="body2" style={{ marginTop: "16px" }}>
          Don't have an Account?{" "}
          <Link href="/signup" color="primary">
            Sign Up Here
          </Link>
        </Typography>
      </form>
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
