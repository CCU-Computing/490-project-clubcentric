import { React, useState } from 'react';
import Menu from './Menu';
import ShortMenu from './ShortMenu';
import logo from '../../assets/images/Chants_Logo.png';
import {Link, useLocation} from 'react-router';

import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, CssBaseline, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon, ExpandLess, ExpandMore, Groups2 as Groups2Icon, Person as PersonIcon, Home as HomeIcon, CalendarMonth as EventIcon } from '@mui/icons-material';

const drawerWidth = 240;
const shortDrawerWidth = 80;

const menuItems = [
  { label: 'Home', to: '/home', icon: <HomeIcon /> },
  { label: 'Profile', to: '/profile', icon: <PersonIcon /> },
  { label: 'Clubs', to: '/clubs', icon: <Groups2Icon /> },
  { label: 'Events', to: '/events', icon: <EventIcon />}
  // You can add more items here for Profile, Groups, etc.
];

export default function Navbar({content}) 
{
  // Variable to see big menu or collapsed menu (shortMenu)
  const [isBigMenu, setIsBigMenu] = useState(false)
  const location = useLocation();
  const path = location.pathname;

  // Fucntion to change the value of isBigMenu to the opposite (true/false)
  const changeMenu = () => {
    setIsBigMenu(!isBigMenu)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        color= "primary" 
        position="fixed" 
        sx=
        {{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          backgroundColor: "#093331",
          color: "#fff"
        }}
      >
        <Toolbar >
            {/* Below is the code for the colapsing menu */}
            <IconButton onClick={() => setIsBigMenu(!isBigMenu)} sx={{marginRight: '10px', color: 'white'}}>
              {isBigMenu ? <MenuOpenIcon/> : <MenuIcon/>}
            </IconButton>
            {/* FIXME: Replace Image with CCU Logo (the little thing with the bars) */}
            <img width='4%' height= '4%' src={logo} alt="Logo"/>
            <Typography variant="h" noWrap component="div" sx={{ 
              ml: 1,
              fontSize: "2rem",
              fontWeight: "bold",
              fontFamily: "Segoe UI"
              }}>
              Club Centric
            </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx=
        {{
          width: isBigMenu ? drawerWidth: shortDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: isBigMenu ? drawerWidth: shortDrawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List sx={{ 
          width: '100%',
          maxWidth: 360, 
          bgcolor: 'background.paper',
          color: "#000",
           }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={path === item.to}
              sx={{ 
                justifyContent: isBigMenu ? 'flex-start' : 'center',
                '&.Mui-selected .MuiSvgIcon-root': {
                  color: '#eeeeee',
                },
                '& .MuiSvgIcon-root': {
                  color: '#555',
                }
              }}
            >
            <ListItemIcon sx=
              {{ 
                justifyContent: 'center',
                '&.Mui-selected ': 
                {
                  backgroundColor: '#eeeeee',
                } 
              }}>{item.icon}</ListItemIcon>
              {isBigMenu && <ListItemText primary={item.label} />}
            </ListItemButton>
            ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
           {content} 
      </Box>
    </Box>
  );
}