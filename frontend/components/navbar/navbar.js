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
import LuggageIcon from '@mui/icons-material/Luggage';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';



const drawerWidth = 240;
const navLinks = ["dashboard","trips","visitedplaces"];
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [option,setOption] = React.useState(["place"]);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
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
          width: "20ch"
        }
      }
    }
  }));

  const handleChange = (event, newOption) => {
    console.log(newOption)
    setOption(newOption);
  };


  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
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
    <Box sx={{ display: "flex" ,justifyContent:"space-between" }}>
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
          <Box sx={{ ml: 8,display : "flex"}}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <ToggleButtonGroup
                value={option}
                exclusive
                onChange={handleChange}
                aria-label="text formatting"
            >
                <ToggleButton value="place" aria-label="bold" defaultChecked>
                <LuggageIcon/>  
                </ToggleButton>
                <ToggleButton value="person">
                <PersonPinCircleIcon/>
                </ToggleButton>
            </ToggleButtonGroup>
            </Box>
          <Box sx={{ ml : 10,display: { xs: "none", sm: "block" }, alignItems:"center",justifyContent:"center"}}>
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
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}



export default Navbar;