import { React, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { IconButton } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Menu from './Menu';
import ShortMenu from './ShortMenu';
import logo from '../../assets/images/Chants_Logo.png';


const drawerWidth = 240;
const shortDrawerWidth = 80;

export default function Navbar({content}) {
  // Variable to see big menu or collapsed menu (shortMenu)
  const [isBigMenu, setIsBigMenu] = useState(false)

  // Fucntion to change the value of isBigMenu to the opposite (true/false)
  const changeMenu = () => {
    setIsBigMenu(!isBigMenu)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar >
            {/* Below is the code for the colapsing menu */}
            <IconButton onClick={changeMenu} sx={{marginRight: '10px', color: 'white'}}>
              {isBigMenu ? <MenuOpenIcon/> : <MenuIcon/>}
            </IconButton>
            {/* FIXME: Replace Image with CCU Logo (the little thing with the bars) */}
            <img width='4%' height= '4%' src={logo}/>
            <Typography variant="h" noWrap component="div">
              Coastal Carolina University
            </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: isBigMenu ? drawerWidth: shortDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: isBigMenu ? drawerWidth: shortDrawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
          {isBigMenu ? <Menu/> : <ShortMenu/>}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
           {content} 
      </Box>
    </Box>
  );
}