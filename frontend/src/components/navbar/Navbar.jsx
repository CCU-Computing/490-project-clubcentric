import { React, useState } from 'react';
import Menu from './Menu';
import ShortMenu from './ShortMenu';
import logo from '../../assets/images/Chants_Logo.png';
import { Link, useLocation } from 'react-router';

import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, CssBaseline, List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon, ExpandLess, ExpandMore, Groups2 as Groups2Icon, Person as PersonIcon, Home as HomeIcon, CalendarMonth as EventIcon, Search as SearchIcon } from '@mui/icons-material';

const drawerWidth = 240;
const shortDrawerWidth = 80;

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <HomeIcon /> },
  { label: 'Profile', to: '/profile', icon: <PersonIcon /> },
  { label: 'Search Clubs', to: '/search', icon: <SearchIcon /> }
];

export default function Navbar({ content }) {
  // Variable to see big menu or collapsed menu (shortMenu)
  const [isBigMenu, setIsBigMenu] = useState(false);
  const location = useLocation();
  const path = location.pathname;

  // Function to change the value of isBigMenu to the opposite (true/false)
  const changeMenu = () => {
    setIsBigMenu(!isBigMenu);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        color="primary"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#093331',
          color: '#fff'
        }}
      >
        <Toolbar>
          {/* Below is the code for the collapsing menu */}
          <IconButton onClick={() => setIsBigMenu(!isBigMenu)} sx={{ marginRight: '10px', color: 'white' }}>
            {isBigMenu ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <img width="4%" height="4%" src={logo} alt="Logo" />
          <Typography
            variant="h"
            noWrap
            component="div"
            sx={{
              ml: 1,
              fontSize: '2rem',
              fontWeight: 'bold',
              fontFamily: 'Segoe UI'
            }}
          >
            Club Centric
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: isBigMenu ? drawerWidth : shortDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isBigMenu ? drawerWidth : shortDrawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#A27752', // bronze background for the drawer paper
            color: '#fff' // text/icons inherit white unless overridden
          }
        }}
      >
        <Toolbar />
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'transparent', // let the drawer paper show through
            color: '#fff'
          }}
        >
          {menuItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={path === item.to}
              sx={{
                justifyContent: isBigMenu ? 'flex-start' : 'center',
                color: 'inherit',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.12)'
                },
                '& .MuiSvgIcon-root': {
                  color: 'inherit'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: 'center',
                  color: 'inherit',
                  '&.Mui-selected ': {
                    backgroundColor: '#eeeeee'
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isBigMenu && <ListItemText primary={item.label} sx={{ color: 'inherit' }} />}
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
