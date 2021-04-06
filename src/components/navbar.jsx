import React, { useEffect } from 'react';
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
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import config from "../config.json";
import Utils from "./utils.js";
import DateFnsUtils from '@date-io/date-fns';

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
    },
    formControl: {
        marginTop: theme.spacing(1),
        minWidth: 150,
    },

}));

export default function NavBar(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const [showBackDrop, setShowBackDrop] = React.useState(false);
    const [currentProject, setCurrentProject] = React.useState(-1);
    const [currentWarehouse, setCurrentWarehouse] = React.useState(-1);
    const [roles, set_roles] = React.useState([]);

    async function getProjectList() {
        try {
            let url = config["baseurl"] + "/api/project/list?count=" + 10000 + "&offset=" + 0 + "&search=";
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            console.log(data);
            let projs = [];
            for (let i = 0; i < data.list.docs.length; ++i) {
                let proj = data.list.docs[i]
                const dateFns = new DateFnsUtils();
                proj.startdate_conv = dateFns.date(proj.startdate);
                proj.exp_enddate_conv = dateFns.date(proj.exp_enddate);

                projs.push(proj);
            }

            props.setProjects(projs);
        }
        catch (e) {

            if (e.response) {
                setErrorMessage(e.response.data.message);
            }
            else {
                setErrorMessage("Error in getting list");
            }
            setShowError(true);
        }
    }

    async function getWarehouses() {
        try {
            let url = config["baseurl"] + "/api/warehouse/list?boundary=1";
            axios.defaults.headers.common['authToken'] = window.localStorage.getItem("authToken");
            const { data } = await axios.get(url);
            console.log(data);

            props.setWarehouses(data.list);
        }
        catch (e) {
            console.log("Error in getting users list");
            setErrorMessage("Error in getting users list");
            setShowError(true);
        }
    }

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

    const handleModeChange = (event) => {
        console.log("event.target.value: ", event.target.value);
        props.setCurrentMode(event.target.value);
        if (props.modes[event.target.value] === "Projects")
            getProjectList();
        if (props.modes[event.target.value] === "Warehouse")
            getWarehouses();
    };

    const handleProjectChange = (event) => {
        console.log("event.target.value: ", event.target.value);
        setCurrentProject(event.target.value)
        props.setProject(props.projects[event.target.value]);
    }

    const handleWarehouseChange = (event) => {
        console.log("event.target.value: ", event.target.value);
        setCurrentWarehouse(event.target.value)
        props.setSelectedWarehouse(props.warehouses[event.target.value]);
    }

    useEffect(() => {
        let profile = JSON.parse(window.localStorage.getItem("profile"));
        set_roles(profile.role);
    }, []);

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
                    <img src={logo} width='100' alt="" />
                    {/* <IconButton className={clsx(classes.menuButton, {
                        [classes.hide]: props.drawerOpen,
                    })}>
                        <img src={logo} width='100' alt="" />
                    </IconButton> */}
                    {props.drawerOpen && <img src={logo} width='140' alt="" />}
                    <FormControl size="small" variant="outlined" className={classes.formControl}>
                        <InputLabel size="small" id="mode-select-label">Mode *</InputLabel>
                        <Select
                            labelId="mode-select-label"
                            id="mode-select-label"
                            value={props.currentMode === -1 ? "" : props.currentMode}
                            onChange={handleModeChange}
                            label="mode *"
                            size="small"
                        >
                            {props.modes && props.modes.map((row, index) => {
                                return (
                                    <MenuItem key={"" + index} value={index}>{row}</MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    {(props.modes[props.currentMode] === "Projects") &&
                        <FormControl size="small" variant="outlined" className={classes.formControl}>
                            <InputLabel size="small" id="project-select-label">Project *</InputLabel>
                            <Select
                                labelId="project-select-label"
                                id="project-select-label"
                                value={currentProject === -1 ? "" : currentProject}
                                onChange={handleProjectChange}
                                label="Project *"
                                size="small"
                            >
                                {props.projects && props.projects.map((row, index) => {
                                    return (
                                        <MenuItem key={"" + (index + 1)} value={index}>{"" + (index + 1) + "." + row.code + ": " + row.name}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    }
                    {(props.modes[props.currentMode] === "Warehouse") &&
                        <FormControl size="small" variant="outlined" className={classes.formControl} >
                            <InputLabel size="small" id="warehouse-select-label">Warehouse *</InputLabel>
                            <Select
                                labelId="warehouse-select-label"
                                id="warehouse-select-label"
                                value={currentWarehouse === -1 ? "" : currentWarehouse}
                                onChange={handleWarehouseChange}
                                label="Warehouse *"
                                size="small"
                            >
                                {props.warehouses && props.warehouses.map((row, index) => {
                                    return (
                                        <MenuItem key={"" + (index + 1)} value={index}>{"" + (index + 1) + ". " + row.name}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    }

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

            <Backdrop className={classes.backdrop} open={showBackDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

        </div >
    );
}
