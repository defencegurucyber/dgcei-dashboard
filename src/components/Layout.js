import React from "react";
import { Box,Image, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import PopupIcon from '@mui/icons-material/AccountBox';
import ContactsIcon from '@mui/icons-material/Contacts';
import WorkIcon from '@mui/icons-material/Work';

const sidebarItems = [
  { text: "Gallary", icon: <PhotoLibraryIcon />, path: "/gallary" },
  { text: "Courses", icon: <SchoolIcon />, path: "/courses" },
  { text: "Popups", icon: <PopupIcon />, path: "/popups" },
  { text: "Placements", icon: <WorkIcon />, path: "/placements" },
  { text: "Contact Us", icon: <ContactsIcon />, path: "/contact" },
];

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
        <Box sx={{ padding: 2 }}>
        <img alt="DGCEI" src={logo} style={{ width: "10rem", height: "7rem" }} />
        <Typography variant="h6">DGCEI</Typography>
          <Typography variant="h5"> Admin Dashboard</Typography>
        </Box>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem button component={Link} to={item.path} key={index}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
