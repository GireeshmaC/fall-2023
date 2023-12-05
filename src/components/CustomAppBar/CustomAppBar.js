// CustomAppBar.js

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '../../redux/userSlice';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const CustomAppBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        // Handle profile click logic
        handleClose();
        navigate('/profile-page')
    };

    const handleLogoutClick = () => {
        // Handle logout click logic
        handleClose();
        dispatch(logout())
    };
    return (
        <>
            <AppBar position="static" style={{ backgroundColor: '#000000E0', width: '100%' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'start' }}>
                        <Link to="/">
                            <a>Fall 2023</a> {user && `|`} {user && user.firstname} {user && user.lastname} {(user && user.isAdmin !== 0) && '| Admin'}
                        </Link>
                    </Typography>
                    {
                        user ?
                            <>
                                <IconButton color="inherit" onClick={handleClick}>
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                                </Menu>
                            </>
                            :
                            <div style={{display:'flex', alignItems:'center'}}>
                                <Link to="/login">
                                    <a>Login</a>
                                </Link>
                                <Divider orientation="vertical" variant="middle" flexItem/>
                                <Link to="/signup">
                                    <a>Sign Up</a>
                                </Link>
                            </div>
                    }
                </Toolbar>
            </AppBar>
            <div>
                <Outlet />
            </div>
        </>
    );
};

export default CustomAppBar;
