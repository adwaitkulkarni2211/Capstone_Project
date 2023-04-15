import React from "react";
import Alert from "@material-ui/core/Alert";

export default function ErrorMessage({ message }) {
  return (
    <div style={{ display: message ? "" : "none" }}>
      <Alert className="message" variant="filled" severity="error">
        {message}
      </Alert>
    </div>
  );
}
