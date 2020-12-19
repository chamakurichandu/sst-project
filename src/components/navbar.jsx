import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../assets/svg/logos/logo.svg';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Divider from '@material-ui/core/Divider';
import profileImage from '../assets/svg/ss/profile.svg';
import stopWatchImage from '../assets/svg/ss/stopwatch.svg';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        marginRight: 12,
        marginLeft: 12,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // background: 'transparent',
        backgroundColor: 'white',
        // boxShadow: 'true',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '48px',
        '@media (max-width: 420px)': {
            height: "39px",
        }
    },
    appBarRight: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    appBarShift: {
        width: `calc(100%)`,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        margin: '8px 12px',
        // marginLeft: 12,
        color: 'black',
        '@media (max-width: 420px)': {
            margin: '6px 4px',
        }
    },
    hide: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    info: {
        '@media (max-width: 420px)': {
            display: "none",
        }
    }
}));

export default function NavBar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleDrawerOpen = () => {
        props.setDrawerOpen(true);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleVideoCallWaitingMenu = (event) => {

    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSignOutLocal = () => {
        setAnchorEl(null);
        props.handleSignOut();
    };

    const handleBusinessCard = () => {
        setAnchorEl(null);
        props.showBusinessCard(2);
    };

    const gotoFullScreen = () => {
        setAnchorEl(null);
        props.fullScreenHandleEnter();
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.drawerOpen,
                })}
            >
                <div>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: props.drawerOpen,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <IconButton className={clsx(classes.menuButton, {
                        [classes.hide]: props.drawerOpen,
                    })}>
                        <img src={logo} width='100' alt="" />
                    </IconButton>
                </div>

                <div className={classes.appBarRight}>
                    {props.videoCallWaiting && <div >
                        {/* className={classes.info}> */}
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleVideoCallWaitingMenu}
                            color="inherit" >
                            <img src={stopWatchImage} width='25' alt="" />
                            <Typography component="h1" color="secondary" >
                                {"" + (props.videoCallWaitingQueuePosition + 1) + "/" + props.videoCallWaitingQueueSize}
                            </Typography>
                        </IconButton>
                    </div>}
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <img src={profileImage} width='25' alt="" />
                        </IconButton>
                    </div>
                </div>

                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleBusinessCard}>Business Card</MenuItem>
                    <Divider />
                    <MenuItem onClick={gotoFullScreen}>Full Screen</MenuItem>
                    {/* <MenuItem onClick={handleClose}>Chat</MenuItem>
                    <MenuItem onClick={handleClose}>Notifications</MenuItem> */}
                    <Divider />
                    <MenuItem onClick={handleSignOutLocal}>SignOut</MenuItem>
                </Menu>
                {/* </div> */}
            </AppBar>
        </div >
    );
}
