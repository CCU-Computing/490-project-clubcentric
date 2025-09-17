import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Groups2Icon from '@mui/icons-material/Groups2';
import CelebrationIcon from '@mui/icons-material/Celebration';
import {Link, useLocation} from 'react-router';


export default function ShortMenu() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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

      {/* The link logic below goes to the homepage */}
      <ListItemButton onClick={handleClick} component={Link} to='/' selected={path === '/'}> 
        <ListItemIcon>
          <Groups2Icon />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton component={Link} to='/create'  selected={path === '/create'}>
          <ListItemIcon>
              <CelebrationIcon />
          </ListItemIcon>
        <ListItemText primary="Create a Club" />
      </ListItemButton>

    </List>

   
      {/* FIXME: Make it so this button works, edit/delete need a parameter 
                 Maybe add this to the list element above when it works?*/}
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