import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import logo from '../assets/svg/logos/logo.svg';
import lstrings from '../lstrings.js';
import LanguageSelect from './languageSelect';
import exhibitionLogo from '../assets/svg/ss/exhibition.svg';
import auditoriumLogo from '../assets/svg/ss/hall.svg';
import agendaLogo from '../assets/svg/ss/checklist.svg';
import networkingRoomsLogo from '../assets/svg/ss/breakout.svg';
import attendeesLogo from '../assets/svg/ss/team.svg';
import infoLogo from '../assets/svg/ss/ask.svg';
import mentorLogo from '../assets/svg/ss/freedom.svg';
import feedLogo from '../assets/svg/ss/memo.svg';
import { useHistory } from "react-router-dom";
import PanelImage from '../assets/svg/ss/panel.svg';
import LaptopImage from '../assets/svg/ss/laptop.svg';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    menuButton: {
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        left: 'auto',
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        left: 'auto',
        zIndex: theme.zIndex.drawer + 2,
        display: 'flex',
        justifyContent: 'space-between',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        left: 'auto',
        // width: '72px !important',
        transition: theme
            .transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    dividerFullWidth: {
        margin: `10px 0 0 ${theme.spacing(1)}px`,
        textAlign: 'left',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        bottom: 2
    },
    imageIcon: {
        width: '100'
    },
    textStyle: {
        textAlign: 'right',
        paddingRight: '5px'
    },
    textNormal: {
        textAlign: 'left',
        paddingLeft: '5px'
    }
}));

export default function ResponsiveDrawer(props) {
    const { drawerOpen, setDrawerOpen, themeChangedInApp } = props;
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();

    const [language, setLanguage] = React.useState('en');

    const themeChanged = (event) => {
        setLanguage(event.target.value);
        let direction = 'ltr';
        let lang = event.target.value;
        if (event.target.value === 'ar') {
            direction = 'rtl';
            theme.direction = 'rtl';
            lang = 'ar';
        }
        else if (event.target.value === 'en') {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }
        else {
            direction = 'ltr';
            theme.direction = 'ltr';
            lang = 'en';
        }

        document.getElementsByTagName('html')[0].setAttribute("dir", direction);

        lstrings.setLanguage(lang);

        themeChangedInApp();
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    return (

        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: drawerOpen,
                    [classes.drawerClose]: !drawerOpen,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen,
                    }),
                }}
            >
                <div>
                    <div className={classes.toolbar}>
                        <IconButton className={clsx(classes.menuButton, {
                            [classes.hide]: !drawerOpen,
                        })}>
                            <img src={logo} width='150' alt="" />
                        </IconButton>
                        <IconButton onClick={handleDrawerClose} className={clsx(classes.menuButton, {
                            [classes.hide]: !drawerOpen,
                        })}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>

                    {props.isManagePanels &&
                        <div>
                            <Divider />
                            <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                                {lstrings.Manage}
                            </Typography>
                            <List>
                                {props.isExhibitor && <ListItem button key={lstrings.ExhibitorPanel} onClick={() => history.push("/exhibitorpanel")}>
                                    <ListItemIcon><img src={PanelImage} height='25' alt="" /></ListItemIcon>
                                    <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.ExhibitorPanel} />
                                </ListItem>}
                                {props.isSalesMen && <ListItem button key={lstrings.SalesPanel} onClick={() => history.push("/salespanel")}>
                                    <ListItemIcon><img src={LaptopImage} height='25' alt="" /></ListItemIcon>
                                    <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.SalesPanel} />
                                </ListItem>}
                            </List>
                        </div>
                    }

                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.EventFeed}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.EventFeed} onClick={() => history.push("/eventfeed")}>
                            <ListItemIcon><img src={feedLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.EventFeed} />
                        </ListItem>
                    </List>

                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.Spaces}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.ExhibitionStalls} onClick={() => history.push("/exhibitionbooths")}>
                            <ListItemIcon><img src={exhibitionLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.ExhibitionStalls} />
                        </ListItem>
                        <ListItem button key={lstrings.Auditorium} onClick={() => history.push("/auditorium")}>
                            <ListItemIcon><img src={auditoriumLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Auditorium} />
                        </ListItem>
                        <ListItem button key={lstrings.NetworkingRooms} onClick={() => history.push("/networkingrooms")}>
                            <ListItemIcon><img src={networkingRoomsLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.NetworkingRooms} />
                        </ListItem>
                        <ListItem button key={lstrings.mentoringrooms} onClick={() => history.push("/mentoringrooms")}>
                            <ListItemIcon><img src={mentorLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.MentoringRooms} />
                        </ListItem>
                    </List>
                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.Catalogues}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Agenda} onClick={() => history.push("/agenda")}>
                            <ListItemIcon><img src={agendaLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Agenda} />
                        </ListItem>
                        <ListItem button key={lstrings.Exhibitors} onClick={() => history.push("/exhibitors")}>
                            <ListItemIcon><img src={exhibitionLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Exhibitors} />
                        </ListItem>
                        <ListItem button key={lstrings.Attendees} onClick={() => history.push("/attendees")}>
                            <ListItemIcon><img src={attendeesLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Attendees} />
                        </ListItem>
                    </List>
                    <Divider />
                    <Typography className={clsx(classes.dividerFullWidth, theme.direction === 'rtl' ? classes.textStyle : classes.textNormal)} color="textSecondary" display="block" variant="caption">
                        {lstrings.Misc}
                    </Typography>
                    <List>
                        <ListItem button key={lstrings.Help} onClick={() => history.push("/agenda")}>
                            <ListItemIcon><img src={infoLogo} height='25' alt="" /></ListItemIcon>
                            <ListItemText className={theme.direction === 'rtl' ? classes.textStyle : classes.textNormal} primary={lstrings.Help} />
                        </ListItem>
                    </List>
                </div>
                {drawerOpen && <LanguageSelect language={language} themeChanged={themeChanged}></LanguageSelect>}
            </Drawer>
        </div >
    );
}
