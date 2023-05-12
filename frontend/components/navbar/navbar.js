import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LuggageIcon from "@mui/icons-material/Luggage";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Link from "next/link";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const drawerWidth = 240;
const navLinks = ["dashboard", "trips", "visitedplaces"];
const Navbar = () => {
  let jwt = "";

  if (typeof window !== "undefined") {
    jwt = JSON.parse(localStorage.getItem("jwt"));
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [option, setOption] = React.useState(["place"]);
  const [place, setPlace] = React.useState();
  const [result, setResult] = React.useState([]);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  const handleChange = (event, newOption) => {
    console.log(newOption);
    setOption(newOption);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const enterPressed = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      const handleSearchPlace = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/search/${place}`);
          const data = await response.json();
          setResult(data);
        } catch (error) {
          console.error(error);
        }
      };
      const searchPeople = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${jwt.token}`);
    
        var raw = JSON.stringify({
          name: `${place}`,
        });
    
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
    
        try {
          const response = await fetch(
            `http://localhost:3000/api/user/${jwt.user._id}/getUsersByName`,
            requestOptions
          );
          const result = await response.json();
          setResult(result.users.users);
          console.log(result);
        } catch (error) {
          console.log("error", error);
        }
      };

      setOpen(true);
      if(option === "place") {handleSearchPlace()} else searchPeople()
    }
  };
  const addPeople = (name, email, _id) => {
    
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 10 }}>
        TripTravellor
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem key={item} disablePadding>
            <a href={`/${item}`}>
              <ListItemButton sx={{ textAlign: "center" }}>
                <ListItemText primary={item} />
              </ListItemButton>
            </a>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            TripTravellor
          </Typography>
          <Box sx={{ ml: 8, display: "flex" }}>
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => setPlace(e.target.value)}
                value={place}
                
              />
            </Search> */}
            <TextField
              label="Search ..."
              onChange={(e) => setPlace(e.target.value)}
              value={place}
              onKeyDown={enterPressed}
            />
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Search {option === place ? "Place" : "People"} Result
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {option === "place" && result.length > 0 && (
                    <ul className="search-results">
                      {result.map((result) => (
                        <li key={result.features__id}>
                          {result.features__properties__name}
                          <Link
                            href={{
                              pathname: "/place",
                              query: {
                                id: result.features__id,
                                name: result.features__properties__name,
                                kinds: result.features__properties__kinds,
                                coordinate1:
                                  result.features__geometry__coordinates__001,
                                coordinate2:
                                  result.features__geometry__coordinates__002,
                              },
                            }}
                          >
                            <Button size="small">Learn More</Button>
                          </Link>
                        </li>
                      ))}
                      {option === "person" && result &&
                        result.map(({ name, email, _id }) => (
                          <div>
                            <Typography
                              key={_id}
                            >{`name: ${name} & email: ${email}`}</Typography>
                            <Button onClick={() => addPeople(name, email, _id)}>
                              add
                            </Button>
                          </div>
                        ))}
                    </ul>
                  )}
                  .
                </Typography>
              </Box>
            </Modal>
            <ToggleButtonGroup
              value={option}
              exclusive
              onChange={handleChange}
              aria-label="text formatting"
            >
              <ToggleButton value="place" aria-label="bold" defaultChecked>
                <LuggageIcon />
              </ToggleButton>
              <ToggleButton value="person">
                <PersonPinCircleIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box
            sx={{
              ml: 10,
              display: { xs: "none", sm: "block" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {navLinks.map((item) => (
              <a key={item} href={`/${item}`}>
                <Button key={item} sx={{ color: "#fff" }}>
                  {item}
                </Button>
              </a>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;
