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

export default function Navbar({ content }) {
  const [isBigMenu, setIsBigMenu] = useState(false);

  const changeMenu = () => {
    setIsBigMenu(!isBigMenu);
  };

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <CssBaseline />

      {/* ===== App Bar (teal) ===== */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 3,
          backgroundColor: '#008080', // ✅ Teal
        }}
      >
        <Toolbar>
          <IconButton onClick={changeMenu} sx={{ marginRight: '10px', color: 'white' }}>
            {isBigMenu ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <img width="4%" height="4%" src={logo} alt="CCU Logo" />
          <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
            Coastal Carolina University
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ===== Drawer ===== */}
      <Drawer
        variant="permanent"
        sx={{
          width: isBigMenu ? drawerWidth : shortDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isBigMenu ? drawerWidth : shortDrawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        <Toolbar />
        {isBigMenu ? <Menu /> : <ShortMenu />}
      </Drawer>

      {/* ===== Dark overlay (only over main content area) ===== */}
      {isBigMenu && (
        <Box
          onClick={changeMenu}
          sx={{
            position: 'fixed',
            top: '64px',
            left: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            height: 'calc(100vh - 64px)',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* ===== Main Content ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isBigMenu ? `${drawerWidth}px` : `${shortDrawerWidth}px`,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Toolbar />
        {content}
      </Box>
    </Box>
  );
}
