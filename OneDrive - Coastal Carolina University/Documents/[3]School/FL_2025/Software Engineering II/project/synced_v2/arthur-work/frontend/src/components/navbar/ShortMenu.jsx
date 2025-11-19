import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Groups2Icon from '@mui/icons-material/Groups2';
import { Link, useLocation } from 'react-router';
import { justifyContent } from '@mui/system';

export default function ShortMenu() {
  const location = useLocation();
  const path = location.pathname;
  console.log(path);

  return (
    <>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: '#A27752', // bronze background
          color: '#fff',
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {/* This is the code for the Menu buttons on the NavBar when the menu is collapsed. */}
        <ListItemButton
          component={Link}
          to="/"
          selected={path === '/'}
          sx={{ display: 'flex', justifyContent: 'center', color: 'inherit' }}
        >
          <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: 'inherit' }}>
            <Groups2Icon />
          </ListItemIcon>
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/create"
          selected={path === '/create'}
          sx={{ display: 'flex', justifyContent: 'center', color: 'inherit' }}
        >
          <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: 'inherit' }}>
            <CelebrationIcon />
          </ListItemIcon>
        </ListItemButton>
      </List>
    </>
  );
}
