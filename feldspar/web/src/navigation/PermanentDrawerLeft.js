import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import About from '../screens/About';
import AssetVisualizer from '../screens/AssetVisualizer';

const drawerWidth = 240;

export default function PermanentDrawerLeft() {
    const [content, setContent] = useState(About());
    const [selected, setSelected] = useState('About');

    const handleAssetVisualizerClick = () => {
        setSelected('Asset Visualizer');
        setContent(AssetVisualizer);
    }

    const handleAboutClick = () => {
        setSelected('About');
        setContent(About());
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Feldspar
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Divider />
                <List>
                    <ListItem key='About' disablePadding>
                        <ListItemButton selected={selected === 'About'} onClick={handleAboutClick}>
                            <ListItemText primary='About' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Asset Visualizer' disablePadding>
                        <ListItemButton selected={selected === 'Asset Visualizer'} onClick={handleAssetVisualizerClick}>
                            <ListItemText primary='Asset Visualizer' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <Toolbar />
                {content}
            </Box>
        </Box>
    );
}