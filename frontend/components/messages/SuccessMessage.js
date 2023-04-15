import React from "react";
import Alert from "@material-ui/core/Alert";

export default function SuccessMessage({ message }) {
  return (
    <div style={{ display: message ? "" : "none" }}>
      <Alert className="message" variant="filled" severity="success">
        {message}
      </Alert>
    </div>
  );
}
