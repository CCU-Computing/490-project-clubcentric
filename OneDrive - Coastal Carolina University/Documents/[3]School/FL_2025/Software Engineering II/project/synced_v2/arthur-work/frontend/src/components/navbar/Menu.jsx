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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {Link, useLocation} from 'react-router';


export default function Menu() {
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
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.charcoal' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Coastal Carolina Organizations
        </ListSubheader>
      }
    >

      {/* The link logic below goes to the homepage */}
      <ListItemButton onClick={handleClick} component={Link} to='/' selected={path === '/'}> 
        <ListItemIcon>
          <Groups2Icon />
        </ListItemIcon>
        <ListItemText primary="Organizations" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Student Organizations" />
          </ListItemButton>

          
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Department Organizations" />
          </ListItemButton>

        </List>
      </Collapse>
    </List>
    <List component="div" disablePadding>
        
      <ListItemButton sx={{ pl: 4 }}>
        <ListItemIcon>
          <CalendarMonthIcon />
        </ListItemIcon>
        <ListItemText primary="Calendar" />
      </ListItemButton>

    </List>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Club Actions
        </ListSubheader>
      }
    >


      <ListItemButton component={Link} to='/create'  selected={path === '/create'}>
          <ListItemIcon>
              <CelebrationIcon />
          </ListItemIcon>
        <ListItemText primary="Create a Club" />
        
      </ListItemButton>

      {/* FIXME: Make it so this button works, edit/delete need a parameter */}
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

      
    </List>
    </>
  );
}