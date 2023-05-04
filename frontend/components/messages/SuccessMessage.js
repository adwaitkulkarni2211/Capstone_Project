import React from "react";
import Alert from "@material-ui/core/Alert";
import { IconButton, Box, Collapse } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

export default function SuccessMessage({ message }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ display: message ? "" : "none" }}>
      <Box>
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            }
            sx={{ mb: 2 }}
            className="message"
            variant="filled"
            severity="success"
          >
            {message}
          </Alert>
        </Collapse>
      </Box>
    </div>
  );
}
