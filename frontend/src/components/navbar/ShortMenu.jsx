import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import CelebrationIcon from '@mui/icons-material/Celebration';
import Groups2Icon from '@mui/icons-material/Groups2';
import {Link, useLocation} from 'react-router';
import { justifyContent } from '@mui/system';


export default function ShortMenu() {


  const location = useLocation()
  const path = location.pathname
  console.log(path)

  return (
    <>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"

    >

      {/* This is the code for the Menu buttons on the NavBar when the menu is collapsed. */}
      {/* FIXME: Maybe add this -->   inside the 
          <ListItemButton> tag after selected statement. I couldn't get it to work -Lauren*/}
      <ListItemButton component={Link} to='/' selected={path === '/'} sx={{display:'flex', justifyContent:'center'}}>  
        <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
          <Groups2Icon />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton component={Link} to='/create'  selected={path === '/create'} sx={{display:'flex', justifyContent:'center'}}>
          <ListItemIcon sx={{display:'flex', justifyContent:'center'}}>
              <CelebrationIcon />
          </ListItemIcon>
      </ListItemButton>

    </List>

   
      {/* FIXME: Make it so this button works, edit/delete need a parameter 
                 Maybe add this to the list element above when it works*/}
      {/* <ListItemButton>
          <ListItemIcon>
              <CelebrationIcon />
          </ListItemIcon>
          <ListItemText primary="Edit a Club" />
      </ListItemButton>

      <ListItemButton component={Link} to='/delete'>
          <ListItemIcon>
              <CelebrationIcon />
          </ListItemIcon>
        <ListItemText primary="Delete a Club" />
      </ListItemButton> */}

    </>
  );
}